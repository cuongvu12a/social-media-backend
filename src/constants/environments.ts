import * as dotenv from 'dotenv';
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL || '';

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '';
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const PORT = process.env.PORT || 5000
export const UPLOADS_FOLDER = process.env.UPLOADS_FOLDER || ''

