import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type Role = "customer" | "admin" | "staff";

const JWT_SECRET = process.env.JWT_SECRET || "retaste_secret";

interface AuthPayload {
  id: number | string;
  email: string;
  role: Role;
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, data: null, message: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    (req as Request & { user?: AuthPayload }).user = payload;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, data: null, message: "Invalid token" });
  }
};

export const authorizeRoles = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const request = req as Request & { user?: AuthPayload };
    if (!request.user) {
      return res
        .status(401)
        .json({ success: false, data: null, message: "Unauthorized" });
    }

    if (!roles.includes(request.user.role)) {
      return res
        .status(403)
        .json({ success: false, data: null, message: "Forbidden" });
    }

    next();
  };
};
