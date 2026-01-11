import { authMiddleware } from "./src/infrastructure/http/middlewares/auth-middleware";

export default authMiddleware;

export const config = {
  matcher: [
    '/((?!api/hello|reference|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
