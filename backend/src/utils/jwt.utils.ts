import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const VERIFY_EMAIL_SECRET = process.env.VERIFY_EMAIL_SECRET || "verify_email_secret"

export const emailVerificationToken = (email: string) => {
    return jwt.sign({email}, VERIFY_EMAIL_SECRET, {"expiresIn": "1d"})
}