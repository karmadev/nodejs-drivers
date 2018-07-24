import * as fs from 'fs'
import * as S from 'sequelize'
const Sequelize = S as any

export const makeDb = config => {
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

  const db = new Sequelize(DB_DB, DB_USR, DB_PSW, {
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

  const dbDriver = (sqlString, bind) =>
    db
      .query(sqlString, bind)
      .catch(err => {
        throw err
      })
      .then(sqlData => sqlData)

  return {
    dbClose: () => {
      db.close()
    },
    dbDriver,
  }
}
