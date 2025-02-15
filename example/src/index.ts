import { createStore, SQLiteExecutor } from '@rjfranco/kvite'
import { createBetterSqliteExecutor } from '@rjfranco/kvite/better-sqlite3'
import Database from 'better-sqlite3'

const db = new Database('./example.db')

const executor: SQLiteExecutor = createBetterSqliteExecutor(db)

async function main() {
  const store = await createStore(executor, 'test')

  await store.instertMultiple([
    {
      key: `user:1`,
      value: {
        name: 'John Doe',
        email: 'random@email.com'
      }
    },
    {
      key: `user:2`,
      value: {
        name: 'Jane Smith',
        email: 'jane.smith@email.com'
      }
    },
    {
      key: `user:3`,
      value: {
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com'
      }
    }
  ])

  console.log('Get All:')
  let log: unknown = await store.getAll()
  console.log(log) // value

  console.log('Get user:1:')
  log = await store.get('user:1')
  console.log(log) // unique

  console.log("Get all subfields of 'user':")
  log = await store.getSubFields('user')
  console.log(log) // subfields

  console.log('Get all keys:')
  log = await store.getKeys()
  console.log(log) // key

  await store.set('user:4', {
    name: 'Bob Brown',
    email: 'bob.brown@email.com'
  })

  console.log('After added user:4:')
  log = await store.getAll()
  console.log(log) // value

  await store.delete('user:2')

  console.log('After delete user:2')
  log = await store.getAll()
  console.log(log) // value
}

console.log('Running example...')
main().then(() => {
  console.log('Done!')
  process.exit(0)
})
