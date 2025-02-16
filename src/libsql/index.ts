import * as LibSQLNode from '@libsql/client'
import * as LibSQLWeb from '@libsql/client/web'

import { ExecutorFactory, ParamsType } from '../types'

const createExecutor = <DB extends LibSQLNode.Client>(db: DB) => {
  return {
    getMany: async <T>(query: string, key?: string) => {
      const result = await db.execute({ sql: query, args: key ? [key] : [] })

      return result.rows.map(row => {
        const res: Record<string, unknown> = {}
        Object.keys(row).forEach(key => {
          if (key !== 'length' && typeof key !== 'number') res[key] = row[key]
        })
        return res
      }) as T
    },
    insert: async (query: string, params?: ParamsType) => {
      await db.execute({ sql: query, args: params ? params : [] })
    },
    batchInsert: async (query: string, params: ParamsType[]) => {
      await db.batch(
        params.map(param => ({ sql: query, args: param })),
        'write'
      )
    },
    exec: async (query: string, key?: string) => {
      await db.execute({ sql: query, args: key ? [key] : [] })
    }
  }
}

export const createLibSQLNodeExecutor: ExecutorFactory<LibSQLNode.Client> = createExecutor
export const createLibSQLEdgeExecutor: ExecutorFactory<LibSQLWeb.Client> = createExecutor
