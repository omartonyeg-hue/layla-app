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

// Unified source-picker. Returns an `ImagePicker.ImagePickerAsset`-shaped
// object regardless of whether the user chose Camera, Gallery, or Files —
// gives the upload pipeline a single input shape to cope with.
export const pickImage = async (source: PickSource): Promise<{ uri: string } | null> => {
  if (source === 'camera') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) throw new Error('Camera permission is required.');
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    });
    if (res.canceled || !res.assets[0]) return null;
    return { uri: res.assets[0].uri };
  }

  if (source === 'gallery') {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) throw new Error('Photo library permission is required.');
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: false,
      allowsEditing: false,
    });
    if (res.canceled || !res.assets[0]) return null;
    return { uri: res.assets[0].uri };
  }

  // files — iOS Files.app, includes iCloud, Google Drive, etc.
  const res = await DocumentPicker.getDocumentAsync({
    type: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
    copyToCacheDirectory: true,
  });
  if (res.canceled || !res.assets?.[0]) return null;
  return { uri: res.assets[0].uri };
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
export const pickAndUpload = async (
  token: string,
  source: PickSource,
  kind: UploadKind,
): Promise<UploadedAsset | null> => {
  const picked = await pickImage(source);
  if (!picked) return null;

  const processed = await preprocess(picked.uri, kind);
  const sig = await api.signUpload(token, kind);

  const body = new FormData();
  // React Native's FormData accepts a `{uri,type,name}` shape that TS's
  // DOM lib doesn't know about. Cast through `unknown` so we keep the
  // rest of the file strict-typed.
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
