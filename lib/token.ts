import { base64url } from "jose";
import { getRandomValues } from "uncrypto";

export function createVerificationToken(): string {
  const randomValues = new Uint8Array(32);
  getRandomValues(randomValues);
  return base64url.encode(randomValues);
}
