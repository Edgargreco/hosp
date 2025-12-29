import dotenv from 'dotenv';
dotenv.config();
export const config = {
    // Server
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    // Database
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'u242865367_hospital',
    },
    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'change-this-secret-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    // CORS
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    // Admin
    admin: {
        email: process.env.ADMIN_EMAIL || 'admin@hospital.com',
        password: process.env.ADMIN_PASSWORD || 'admin123456',
    },
};
//# sourceMappingURL=config.js.map