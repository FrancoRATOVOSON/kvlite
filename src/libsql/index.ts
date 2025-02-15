import * as LibSQLNode from '@libsql/client'
import * as LibSQLWeb from '@libsql/client/web'

import { ExecutorFactory } from '../types'

const createExecutor = <DB extends LibSQLNode.Client>(db: DB) => {
  return async <T>(query: string, params: unknown[] = []) => {
    const result = await db.execute({ sql: query, args: params as LibSQLNode.InArgs })

    return result.rows.map(row => {
      const res: Record<string, unknown> = {}
      Object.keys(row).forEach(key => {
        if (key !== 'length' && typeof key !== 'number') res[key] = row[key]
      })
      return res
    }) as T
  }
}

export const createLibSQLNodeExecutor: ExecutorFactory<LibSQLNode.Client> = createExecutor
export const createLibSQLEdgeExecutor: ExecutorFactory<LibSQLWeb.Client> = createExecutor
