import 'dotenv/config';

const required = (key: string): string => {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required env var: ${key}`);
  return v;
};

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  jwtSecret: required('JWT_SECRET'),
  otpDevLog: process.env.OTP_DEV_LOG === 'true',
  smsProvider: process.env.SMS_PROVIDER ?? 'none',
  // Cloudinary (photo upload). Optional at boot — the signed-upload route
  // returns 503 until all three are set. Cloud name is public; API key is
  // semi-public (safe in signed-upload context); API secret MUST stay
  // server-only.
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    apiKey: process.env.CLOUDINARY_API_KEY ?? '',
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
    uploadFolder: process.env.CLOUDINARY_FOLDER ?? 'layla',
  },
};

export const cloudinaryConfigured = () =>
  !!(config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret);
