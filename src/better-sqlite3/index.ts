import BetterSQLite3 from 'better-sqlite3'

import { ExecutorFactory, ParamsType } from '../types'

export const createBetterSqliteExecutor: ExecutorFactory<BetterSQLite3.Database> = db => {
  return {
    getUnique: <T>(query: string, key: string) => {
      return new Promise<T | null>((resolve, reject) => {
        try {
          const stmt = db.prepare<string[], T>(query)
          const result = stmt.get(key)
          resolve(result ?? null)
        } catch (error) {
          reject(error)
        }
      })
    },
    getMany: <T>(query: string, key?: string) => {
      return new Promise<T[]>((resolve, reject) => {
        try {
          const stmt = db.prepare<string[], T>(query)
          const result = key ? stmt.all(key) : stmt.all()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
    },
    insert: (query: string, params?: ParamsType) => {
      return new Promise<void>((resolve, reject) => {
        try {
          const stmt = db.prepare<string[], void>(query)
          if (params) stmt.run(...params)
          else stmt.run()
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    batchInsert: (query: string, params: ParamsType[]) => {
      return new Promise<void>((resolve, reject) => {
        try {
          const stmt = db.prepare<string[], void>(query)
          const insertMany = db.transaction((params: ParamsType[]) => {
            for (const param of params) stmt.run(...param)
          })
          insertMany(params)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    exec: (query: string, key?: string) => {
      return new Promise<void>((resolve, reject) => {
        try {
          const stmt = db.prepare<string[], void>(query)
          if (key) stmt.run(key)
          else stmt.run()
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
