import { ParamsValueType, SQLiteExecutorObject } from './types'

export default class Store {
  private executor: SQLiteExecutorObject
  private storeName: string

  constructor(executor: SQLiteExecutorObject, storeName: string) {
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

    await this.executor.exec(init)
  }

  async set(key: string, value: ParamsValueType) {
    const stringValue = JSON.stringify(value)
    const insert = `
    INSERT INTO ${this.storeName} (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value;
    `

    await this.executor.insert(insert, [key, stringValue])
  }

  async get<T>(key: string): Promise<T | undefined> {
    const select = `SELECT value FROM ${this.storeName} WHERE key = ?;`
    const queryResult = await (this.executor.getUnique
      ? this.executor.getUnique<{ value: string }>(select, key)
      : this.executor.getMany<{ value: string }>(select, key))

    let result: string | undefined
    if (!queryResult) return undefined
    if (Array.isArray(queryResult)) result = queryResult.at(0)?.value
    else result = queryResult.value

    return result ? (JSON.parse(result) as T) : undefined
  }

  async delete(key: string) {
    const del = `DELETE FROM ${this.storeName} WHERE key = ?`
    await this.executor.exec(del, key)
  }

  async instertMultiple(items: Array<{ key: string; value: ParamsValueType }>) {
    const insert = `
    INSERT INTO ${this.storeName} (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value;
    `
    await this.executor.batchInsert(
      insert,
      items.map(({ key, value }) => [key, JSON.stringify(value)])
    )
  }

  async getKeys(options?: { limit: number; offset: number }): Promise<string[]> {
    const optionsString = options ? `LIMIT ${options.limit} OFFSET ${options.offset}` : ''
    const select = `SELECT key FROM ${this.storeName} ${optionsString};`
    const result: Array<{ key: string }> = await this.executor.getMany(select)
    return result.map(row => row.key)
  }

  async getAll(options?: { limit: number; offset: number }): Promise<Record<string, unknown>> {
    const optionsString = options ? `LIMIT ${options.limit} OFFSET ${options.offset}` : ''
    const select = `SELECT key, value FROM ${this.storeName} ${optionsString};`
    const result: Array<{ key: string; value: string }> = await this.executor.getMany(select)
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
    const result: Array<{ key: string; value: string }> = await this.executor.getMany(
      select,
      `${prefix}%`
    )
    return result.map(({ key, value }) => ({ key, value: JSON.parse(value) as T }))
  }
}
