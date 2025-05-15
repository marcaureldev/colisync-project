import crypto from "crypto"
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;  // Nombre de tours de salage (10–12 est un bon compromis)

export const generateNumericOTP = (length = 6): string => {
  let otp = ""
  while (otp.length < length) {
    const byte = crypto.randomBytes(1)[0]
    const digit = byte % 10
    otp += digit.toString()
  }
  return otp
}


/**
 * Génère un token aléatoire hexadécimal sécurisé.
 * @param byteLength Nombre de bytes (16 par défaut = 32 caractères hex)
 * @returns Un token aléatoire sécurisé
 */
export const generateToken = (byteLength = 32): string => {
  return crypto.randomBytes(byteLength).toString("hex")
}

/**
 * Hash un mot de passe avec bcrypt.
 * @param password Le mot de passe à hasher
 * @returns Le mot de passe hashé
 */
export async function hashPassword(password: string): Promise<string> {
  // Génère un salt unique et retourne le hash
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  // Compare le mot de passe en clair avec son hash
  return bcrypt.compare(password, hashedPassword);
}

