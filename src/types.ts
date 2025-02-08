export type SQLiteExecutor = <T = unknown>(query: string, params?: unknown[]) => Promise<T>
