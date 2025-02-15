import BetterSQLite3 from 'better-sqlite3'

import { ExecutorFactory } from '../types'

export const createBetterSqliteExecutor: ExecutorFactory<BetterSQLite3.Database> = db => {
  return <T>(query: string, params: unknown[] = []) => {
    return new Promise<T>((resolve, reject) => {
      try {
        const stmt = db.prepare(query)
        let result
        if (query.trim().toUpperCase().startsWith('SELECT')) {
          result = stmt.all(params)
        } else {
          result = stmt.run(params)
        }
        resolve(result as T)
      } catch (error) {
        reject(error)
      }
    })
  }
}
