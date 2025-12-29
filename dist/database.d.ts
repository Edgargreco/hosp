import mysql from 'mysql2/promise';
declare const pool: mysql.Pool;
interface QueryResult {
    rows: any[];
    rowCount: number;
}
export declare function getConnection(): Promise<mysql.PoolConnection>;
export declare function query(text: string, params?: unknown[]): Promise<QueryResult>;
export declare function verifyConnection(): Promise<boolean>;
export { pool };
//# sourceMappingURL=database.d.ts.map