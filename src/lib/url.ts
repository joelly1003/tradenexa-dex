export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL && process.env.VERCEL_ENV === "production") {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  return process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://tradenexa.com";
}
