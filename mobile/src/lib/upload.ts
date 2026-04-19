import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { api } from './api';

export type UploadKind = 'avatar' | 'post' | 'story';
export type PickSource = 'camera' | 'gallery' | 'files';

export type UploadedAsset = {
  url: string;        // Cloudinary secure_url (stored in DB)
  width: number;
  height: number;
  bytes: number;
};

// Per-surface preprocessing so we don't ship full-res phone photos over
// Egyptian LTE. Aspect ratios mirror Instagram's — 1:1 avatars, 4:5 posts,
// 9:16 stories. Cloudinary handles further transforms at delivery time.
const targetFor = (kind: UploadKind) => {
  switch (kind) {
    case 'avatar': return { maxSize: 640, aspect: [1, 1] as [number, number], compress: 0.85 };
    case 'post':   return { maxSize: 1080, aspect: [4, 5] as [number, number], compress: 0.85 };
    case 'story':  return { maxSize: 1080, aspect: [9, 16] as [number, number], compress: 0.8 };
  }
};

// Unified source-picker. Returns an array of local URIs so the upload
// pipeline can handle single (avatar/story) and multi (post carousel) with
// one code path. `count` caps the maximum number of selections from the
// gallery; camera and files always return 0-1 items.
export const pickImages = async (
  source: PickSource,
  count: number = 1,
): Promise<string[]> => {
  if (source === 'camera') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) throw new Error('Camera permission is required.');
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    });
    if (res.canceled || !res.assets[0]) return [];
    return [res.assets[0].uri];
  }

  if (source === 'gallery') {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) throw new Error('Photo library permission is required.');
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: count > 1,
      selectionLimit: count > 1 ? count : 1,
      allowsEditing: false,
      orderedSelection: true,
    });
    if (res.canceled) return [];
    return res.assets.map((a) => a.uri);
  }

  // files — iOS Files.app, includes iCloud, Google Drive, etc.
  const res = await DocumentPicker.getDocumentAsync({
    type: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
    copyToCacheDirectory: true,
    multiple: count > 1,
  });
  if (res.canceled || !res.assets?.length) return [];
  return res.assets.slice(0, count).map((a) => a.uri);
};

// Back-compat wrapper for code that expects a single image.
export const pickImage = async (source: PickSource): Promise<{ uri: string } | null> => {
  const uris = await pickImages(source, 1);
  return uris[0] ? { uri: uris[0] } : null;
};

// Resize + compress on-device before uploading so a 12MP HEIC (~6MB) becomes
// a ~300KB JPEG. Also produces a predictable aspect for square avatars.
const preprocess = async (localUri: string, kind: UploadKind): Promise<{ uri: string; width: number; height: number }> => {
  const { maxSize } = targetFor(kind);
  const result = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: maxSize } }],
    { compress: targetFor(kind).compress, format: ImageManipulator.SaveFormat.JPEG },
  );
  return { uri: result.uri, width: result.width, height: result.height };
};

// Full upload pipeline: pick → preprocess → request signature → multipart
// POST direct to Cloudinary → return secure_url. Callers pass `token` so we
// can auth against our backend for the signature request.
// Single photo pipeline — preprocess + sign + upload one image.
const uploadOne = async (
  token: string,
  localUri: string,
  kind: UploadKind,
): Promise<UploadedAsset> => {
  const processed = await preprocess(localUri, kind);
  const sig = await api.signUpload(token, kind);

  const body = new FormData();
  body.append('file', {
    uri: processed.uri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as unknown as Blob);
  body.append('api_key', sig.apiKey);
  body.append('timestamp', String(sig.timestamp));
  body.append('signature', sig.signature);
  body.append('folder', sig.folder);
  body.append('public_id', sig.publicId);

  const res = await fetch(sig.uploadUrl, { method: 'POST', body });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Upload failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as {
    secure_url: string;
    width: number;
    height: number;
    bytes: number;
  };
  return { url: json.secure_url, width: json.width, height: json.height, bytes: json.bytes };
};

export const pickAndUpload = async (
  token: string,
  source: PickSource,
  kind: UploadKind,
): Promise<UploadedAsset | null> => {
  const uris = await pickImages(source, 1);
  if (uris.length === 0) return null;
  return uploadOne(token, uris[0]!, kind);
};

// Multi-photo pipeline used by the Composer's carousel. `onProgress` fires
// after each uploaded photo so the UI can update `1/N ... N/N`. Each photo
// is uploaded in parallel (Cloudinary handles the concurrency fine; Render
// only signs, never proxies the bytes).
export const pickAndUploadMany = async (
  token: string,
  source: PickSource,
  kind: UploadKind,
  maxCount: number,
  onProgress?: (done: number, total: number) => void,
): Promise<UploadedAsset[]> => {
  const uris = await pickImages(source, maxCount);
  if (uris.length === 0) return [];

  let done = 0;
  const total = uris.length;
  onProgress?.(0, total);
  const assets = await Promise.all(
    uris.map(async (uri) => {
      const a = await uploadOne(token, uri, kind);
      done += 1;
      onProgress?.(done, total);
      return a;
    }),
  );
  return assets;
};
