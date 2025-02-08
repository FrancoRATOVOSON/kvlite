import Store from './store'
import { SQLiteExecutor } from './types'

export { type SQLiteExecutor } from './types'

export async function createStore(executor: SQLiteExecutor, storeName: string): Promise<Store> {
  const store = new Store(executor, storeName)
  await store.initStore()
  return store
}
