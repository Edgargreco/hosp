import mysql from 'mysql2/promise';
import { config } from './config.js';
const pool = mysql.createPool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
export async function getConnection() {
    return pool.getConnection();
}
export async function query(text, params) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(text, params || []);
        return { rows: (rows || []), rowCount: Array.isArray(rows) ? rows.length : 0 };
    }
    finally {
        connection.release();
    }
}
export async function verifyConnection() {
    try {
        const connection = await pool.getConnection();
        await connection.execute('SELECT NOW()');
        connection.release();
        console.log('✓ MySQL Database connected successfully');
        return true;
    }
    catch (err) {
        console.error('✗ Database connection failed:', err);
        return false;
    }
}
export { pool };
//# sourceMappingURL=database.js.map