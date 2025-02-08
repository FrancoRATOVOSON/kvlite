import { SQLiteExecutor } from './types'

export default class Store {
  private executor: SQLiteExecutor
  private storeName: string

  constructor(executor: SQLiteExecutor, storeName: string) {
    this.executor = executor
    this.storeName = storeName
  }

  async initStore() {
    const init = `
    CREATE TABLE IF NOT EXISTS ${this.storeName} (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `

    await this.executor(init)
  }

  async set(key: string, value: unknown) {
    const stringValue = JSON.stringify(value)
    const insert = `
    INSERT INTO ${this.storeName} (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value;
    `

    await this.executor(insert, [key, stringValue])
  }

  async get<T>(key: string): Promise<T | undefined> {
    const select = `SELECT value FROM ${this.storeName} WHERE key = ?;`
    const result = await this.executor<Array<{ value: string }>>(select, [key])
    if (result.length === 0) {
      return undefined
    }
    return JSON.parse(result[0].value) as T
  }

  async delete<T>(key: string) {
    const del = `DELETE FROM ${this.storeName} WHERE key = ?`
    await this.executor<T>(del, [key])
  }

  async instertMultiple(items: Array<{ key: string; value: unknown }>) {
    const insert = `
    INSERT INTO ${this.storeName} (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value;
    `

    await this.executor('BEGIN TRANSACTION;')

    try {
      for (const { key, value } of items) {
        await this.executor(insert, [key, JSON.stringify(value)])
      }
      await this.executor('COMMIT;')
    } catch (error) {
      await this.executor('ROLLBACK;') // Ensure rollback on failure
      throw error
    }
  }

  async getKeys(options?: { limit: number; offset: number }): Promise<string[]> {
    const optionsString = options ? `LIMIT ${options.limit} OFFSET ${options.offset}` : ''
    const select = `SELECT key FROM ${this.storeName} ${optionsString};`
    const result: Array<{ key: string }> = await this.executor(select)
    return result.map(row => row.key)
  }

  async getAll(options?: { limit: number; offset: number }): Promise<Record<string, unknown>> {
    const optionsString = options ? `LIMIT ${options.limit} OFFSET ${options.offset}` : ''
    const select = `SELECT key, value FROM ${this.storeName} ${optionsString};`
    const result: Array<{ key: string; value: string }> = await this.executor(select)
    return result.reduce(
      (acc, row) => {
        acc[row.key] = JSON.parse(row.value)
        return acc
      },
      {} as Record<string, unknown>
    )
  }

  async getSubFields<T>(prefix: string): Promise<Array<{ key: string; value: T }>> {
    const select = `SELECT key, value FROM ${this.storeName} WHERE key LIKE ?;`
    const result: Array<{ key: string; value: T }> = await this.executor(select, [`${prefix}%`])
    return result
  }
}
