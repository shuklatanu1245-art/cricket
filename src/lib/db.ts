// Mock In-Memory Database
// Note: This will reset when the Next.js server restarts (e.g. Vercel cold starts).

export const globalDb = {
  tournaments: [] as any[],
  registrations: [] as any[],
};
