import * as ExpoSQLite from 'expo-sqlite'

import { ExecutorFactory } from '../types'

export const createExpoExecutor: ExecutorFactory<ExpoSQLite.SQLiteDatabase> = db => {
  return <T>(query: string, params: unknown[] = []) => {
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      return db.getAllAsync(query, params as ExpoSQLite.SQLiteBindValue[]) as T
    } else {
      return db.runAsync(query, params as ExpoSQLite.SQLiteBindValue[]) as T
    }
  }
}
