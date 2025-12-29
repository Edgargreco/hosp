import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { config } from './config.js';
export function generateToken(payload) {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}
export function verifyToken(token) {
    try {
        return jwt.verify(token, config.jwt.secret);
    }
    catch (error) {
        return null;
    }
}
export function hashPassword(password) {
    return bcryptjs.hash(password, 10);
}
export function verifyPassword(password, hash) {
    return bcryptjs.compare(password, hash);
}
//# sourceMappingURL=auth.js.map