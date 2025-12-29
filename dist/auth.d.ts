export interface JWTPayload {
    id: string;
    email: string;
    role: string;
    clinic_id: string;
}
export declare function generateToken(payload: JWTPayload): string;
export declare function verifyToken(token: string): JWTPayload | null;
export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
//# sourceMappingURL=auth.d.ts.map