import "dotenv/config";

function readEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const config = {
  host: readEnv("HOST", "0.0.0.0"),
  port: Number(readEnv("PORT", "4000")),
  jwtSecret: readEnv("JWT_SECRET"),
  storageDir: readEnv("STORAGE_DIR", "storage"),
  quoteSweepSeconds: Number(readEnv("QUOTE_SWEEP_SECONDS", "60")),
  documentSealSecret: readEnv("DOCUMENT_SEAL_SECRET", "fedshield-local-seal"),
  attestatoMinScore: Number(readEnv("ATTESTATO_MIN_SCORE", "75")),
  licenseActivationCode: readEnv("LICENSE_ACTIVATION_CODE", "FEDSHIELD-DEMO-KEY"),
  licenseDurationDays: Number(readEnv("LICENSE_DURATION_DAYS", "365")),
  licenseGraceDays: Number(readEnv("LICENSE_GRACE_DAYS", "30")),
};
