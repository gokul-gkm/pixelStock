import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_token_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_token_secret";
const VERIFY_EMAIL_SECRET = process.env.VERIFY_EMAIL_SECRET || "verify_email_secret"

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
};

export const generateRefreashToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const emailVerificationToken = (email: string) => {
    return jwt.sign({email}, VERIFY_EMAIL_SECRET, {"expiresIn": "1d"})
}

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};


export const verifyEmailToken = (token: string): string => {
  try {
    const decoded = jwt.verify(token, process.env.VERIFY_EMAIL_SECRET!) as {
      email: string;
    };
    return decoded.email;
  } catch (error) {
    throw new Error("Invalid or expired verification token");
  }
};


