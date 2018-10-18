import { Db } from './model'
import { IDbConfig } from './types'

function setup(dbResults?: any[][]) {
  const config: IDbConfig = {
    CLIENT_CERT: '',
    CLIENT_KEY: '',
    DB_DB: '',
    DB_HOST: '',
    DB_PSW: '',
    DB_USR: '',
    SERVER_CA: '',
  }
  const db = new Db(config, true, dbResults)
  return db
}

test('close', async () => {
  const db = setup()
  const result = await db.close()
  expect(result).toEqual(undefined)
})

test('exec', async () => {
  const db = setup([[{ foo: 'bar' }]])
  const result = await db.exec('', { type: 'SELECT', bind: {} })
  expect(result).toEqual([{ foo: 'bar' }])
})
