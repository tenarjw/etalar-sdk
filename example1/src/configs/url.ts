const IS_SERVER = typeof window === "undefined";

export function getProtocol() {
  const isProd = process.env.VERCEL_ENV === "production";
  if (isProd) return "https://";
  return "https://"; 
}

export function getAbsoluteUrl() {
  //get absolute url in client/browser
  if (!IS_SERVER) {
    return location.origin;
  }
  //get absolute url in server.
  const protocol = getProtocol();
  if (process.env.NEXT_PUBLIC_NEXTJS_ORIGIN) {
    return `${protocol}${process.env.NEXT_PUBLIC_NEXTJS_ORIGIN}`;
  }
}