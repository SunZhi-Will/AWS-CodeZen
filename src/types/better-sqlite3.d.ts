declare module 'better-sqlite3' {
    export interface Database {
        prepare(sql: string): Statement;
        exec(sql: string): void;
        transaction<T>(fn: () => T): () => T;
        close(): void;
    }

    export interface Statement {
        run(...params: unknown[]): { changes: number; lastInsertRowid: number };
        get(...params: unknown[]): Record<string, unknown>;
        all(...params: unknown[]): Record<string, unknown>[];
    }

    interface DatabaseConstructor {
        new(path: string, options?: DatabaseOptions): Database;
        (path: string, options?: DatabaseOptions): Database;
    }

    export interface DatabaseOptions {
        readonly?: boolean;
        fileMustExist?: boolean;
        timeout?: number;
        verbose?: (message: string) => void;
    }

    const Database: DatabaseConstructor;
    export default Database;
} 