import crypto from "crypto";

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey() {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("Missing ENCRYPTION_KEY (base64) env var");
  }
  const buffer = Buffer.from(key, "base64");
  if (buffer.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes in base64 form");
  }
  return buffer;
}

export function encrypt(plainText) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(payload) {
  const buffer = Buffer.from(payload, "base64");
  const iv = buffer.subarray(0, IV_LENGTH);
  const tag = buffer.subarray(IV_LENGTH, IV_LENGTH + 16);
  const encrypted = buffer.subarray(IV_LENGTH + 16);
  const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
