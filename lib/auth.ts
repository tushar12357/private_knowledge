import { verifyToken } from "./jwt";

export function getUserId(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;

  try {
    const token = auth.replace("Bearer ", "");
    const decoded = verifyToken(token);
    return decoded.userId;
  } catch {
    return null;
  }
}
