import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from './auth.js';
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): void;
export declare function requireRole(...roles: string[]): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=middleware.d.ts.map