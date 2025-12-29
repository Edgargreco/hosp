import { verifyToken } from './auth.js';
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
    req.user = decoded;
    next();
}
export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ error: 'Insufficient permissions' });
            return;
        }
        next();
    };
}
//# sourceMappingURL=middleware.js.map