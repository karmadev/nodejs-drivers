// NOTE: To run these tests, you need to have the migrations built to the dist folder if using typescript.

import { DbMigrator } from './model'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { take } from 'rxjs/operators'

function setup() {
  dotenv.config({ path: path.resolve(__dirname, '../.env.test') })
  const cid = '11111111-1111-1111-1111-111111111111'

  const context = {
    cid,
  }

  if (
    process.env.DB_SSL_MODE !== 'off' &&
    process.env.DB_SSL_MODE !== 'no-cert' &&
    process.env.DB_SSL_MODE !== 'cert'
  ) {
    throw new Error('SSL_MODE was invalid.')
  }

  const dbMigrator = new DbMigrator({
    database: process.env.DB_DATABASE as string,
    host: process.env.DB_HOST as string,
    password: process.env.DB_PASSWORD as string,
    user: process.env.DB_USER as string,
    sslMode: process.env.DB_SSL_MODE,
    directory: process.env.DB_MIGRATIONS_DIRECTORY as string,
    migrationsTableName: process.env.DB_MIGRATIONS_TABLE_NAME as string,
    clientCert: process.env.DB_CLIENT_CERT as string,
    clientKey: process.env.DB_CLIENT_KEY as string,
    serverCa: process.env.DB_SERVER_CA as string,
  })
  return { context, dbMigrator }
}

test('undoMigrationLock', async () => {
  expect.assertions(1)
  const { context, dbMigrator } = setup()
  await dbMigrator.migrate(context)
  const result = await dbMigrator.undoMigrationLock(context)
  dbMigrator.close(context)
  await expect(result).toEqual(undefined)
})

test('rollback', async () => {
  expect.assertions(1)
  const { context, dbMigrator } = setup()
  await dbMigrator.migrate(context)
  const result = await dbMigrator.rollback(context)
  dbMigrator.close(context)
  await expect(result).toEqual('none')
})

test('migrate', async () => {
  expect.assertions(1)
  const { context, dbMigrator } = setup()
  const result = await dbMigrator.migrate(context)
  dbMigrator.close(context)
  await expect(result).toEqual('1542356708711')
})

test('unseed', async () => {
  expect.assertions(1)
  const { context, dbMigrator } = setup()

  await dbMigrator.migrate(context)
  const result = await dbMigrator.unseed(context, 'test')
  dbMigrator.close(context)
  expect(result).toEqual(undefined)
})

test('getLogStream', async () => {
  expect.assertions(1)
  const { context, dbMigrator } = setup()

  const result = dbMigrator
    .getLogStream()
    .pipe(take(1))
    .toPromise()
  await dbMigrator.migrate(context)
  dbMigrator.close(context)
  expect(await result).toEqual({
    cid: '11111111-1111-1111-1111-111111111111',
    level: 'info',
    message: 'Migrated to latest version <1542356708711>.',
  })
})
