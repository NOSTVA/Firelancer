import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create a middleware to handle i18n routing
export default createMiddleware(routing);

// We only want the middleware to run on the `/` route
// to redirect users to their preferred locale
export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
