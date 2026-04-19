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
};
