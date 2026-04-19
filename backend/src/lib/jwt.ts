import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export type JwtPayload = { sub: string };

export const signToken = (userId: string) =>
  jwt.sign({ sub: userId } satisfies JwtPayload, config.jwtSecret, { expiresIn: '30d' });

export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, config.jwtSecret) as JwtPayload;
