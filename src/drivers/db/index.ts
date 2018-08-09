import * as fs from 'fs'
import * as S from 'sequelize'
import * as t from './types'
const Sequelize = S as any

export const makeDb: t.makeDb = config => {
  const { DB_DB, DB_USR, DB_PSW, DB_HOST, DB_SSL_CERT_PATH } = config

  const dialectOptions = DB_SSL_CERT_PATH
    ? {
        ssl: {
          ca: fs.readFileSync(`${DB_SSL_CERT_PATH}/server-ca.pem`),
          cert: fs.readFileSync(`${DB_SSL_CERT_PATH}/client-cert.pem`),
          key: fs.readFileSync(`${DB_SSL_CERT_PATH}/client-key.pem`),
        },
      }
    : { ssl: true }

  const sequelize = new Sequelize(DB_DB, DB_USR, DB_PSW, {
    dialect: 'postgres',
    dialectOptions,
    host: DB_HOST,
    logging: false,
    pool: {
      idle: 10000,
      max: 5,
      min: 0,
    },
  })

  const driver = (
    sqlString: string,
    opts: { type: string; bind: any }
  ): Promise<any> =>
    sequelize
      .query(sqlString, opts)
      .catch(err => {
        throw err
      })
      .then(sqlData => sqlData)

  const db: t.IDb = {
    close: () => {
      sequelize.close()
    },
    driver,
  }

  return db
}
