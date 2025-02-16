import * as ExpoSQLite from 'expo-sqlite'

import { ExecutorFactory, ParamsType } from '../types'

export const createExpoExecutor: ExecutorFactory<ExpoSQLite.SQLiteDatabase> = db => {
  return {
    getUnique: <T>(query: string, key: string) => {
      return db.getFirstAsync<T>(query, key)
    },
    getMany: <T>(query: string, key?: string) => {
      return key ? db.getAllAsync<T>(query, key) : db.getAllAsync<T>(query)
    },
    insert: async (query: string, params?: ParamsType) => {
      if (params) await db.runAsync(query, ...params)
      else await db.runAsync(query)
    },
    batchInsert: (query: string, params: ParamsType[]) => {
      return db.withTransactionAsync(async () => {
        for (const insert of params) await db.runAsync(query, ...insert)
      })
    },
    exec: async (query: string, key?: string) => {
      if (key) {
        db.runAsync(query, key)
      } else db.execAsync(query)
    }
  }
}
