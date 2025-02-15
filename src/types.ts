export type SQLiteExecutor = <T = unknown>(query: string, params?: unknown[]) => Promise<T>

export type ExecutorFactory<T> = (db: T) => SQLiteExecutor
