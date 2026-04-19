import { Router } from 'express';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '../middleware/auth.js';
import { config, cloudinaryConfigured } from '../config.js';

const router = Router();
router.use(requireAuth);

// Signed direct-upload flow:
//   1. Mobile POSTs /uploads/sign with { kind }
//   2. We return cloud_name + api_key + timestamp + folder + signature
//   3. Mobile posts the file directly to Cloudinary with those params —
//      the image never hits Render, so we don't chew up our outbound bandwidth
//      and the upload is fast from Egyptian LTE straight to Cloudinary's CDN
//   4. Mobile POSTs the resulting secure_url back to whatever route owns
//      the asset (account avatar, post media, story media) and we persist it

type UploadKind = 'avatar' | 'post' | 'story';

const SignBody = z.object({
  kind: z.enum(['avatar', 'post', 'story']),
});

// Map kind → Cloudinary folder so assets are easy to audit and purge.
const folderFor = (kind: UploadKind) => {
  const root = config.cloudinary.uploadFolder || 'layla';
  return `${root}/${kind}`;
};

router.post('/sign', (req, res) => {
  if (!cloudinaryConfigured()) {
    return res.status(503).json({ error: 'Photo upload is not configured yet.' });
  }

  const parsed = SignBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = folderFor(parsed.data.kind);
  // `public_id` is prefixed with the caller's userId so we can scope future
  // deletes to the uploader. We don't fix the id here — Cloudinary will
  // append a random suffix — so the same user uploading twice doesn't
  // collide.
  const publicIdPrefix = `${parsed.data.kind}_${req.userId}`;

  // Params that go into the signature — Cloudinary hashes these with the
  // api_secret. The mobile client must send exactly these (and nothing
  // else that's signed) back in the upload request.
  const paramsToSign: Record<string, string | number> = {
    folder,
    public_id: `${publicIdPrefix}_${timestamp}`,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign as Parameters<typeof cloudinary.utils.api_sign_request>[0],
    config.cloudinary.apiSecret,
  );

  return res.json({
    cloudName: config.cloudinary.cloudName,
    apiKey: config.cloudinary.apiKey,
    timestamp,
    signature,
    folder,
    publicId: paramsToSign.public_id,
    // Target URL for the mobile side's multipart POST.
    uploadUrl: `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/image/upload`,
  });
});

export default router;
