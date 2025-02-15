export type SQLiteExecutor = <T = unknown>(query: string, params?: unknown[]) => Promise<T>

type ValueType = string | number | boolean | null
export type ParamsValueType = ValueType | ValueType[] | Record<string, unknown>
export type ParamsType = [string, string]

export type SQLiteExecutorObject = {
  getUnique?: <T = unknown>(query: string, key: string) => Promise<T | null>
  getMany: <T = unknown>(query: string, key?: string) => Promise<T[]>
  insert: (query: string, params?: ParamsType) => Promise<void>
  batchInsert: (query: string, params: ParamsType[]) => Promise<void>
  exec: (query: string, key?: string) => Promise<void>
}

export type ExecutorFactory<T> = (db: T) => SQLiteExecutorObject
