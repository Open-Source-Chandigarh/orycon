import type { Request, Response, NextFunction } from "express";

/**
 * Authorization guard middleware.
 * Ensures the request is authenticated.
 * Can be extended later to support role-based access control (RBAC).
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({
            error: "UNAUTHORIZED",
            message: "Authentication required",
        });
    }

    next();
}
