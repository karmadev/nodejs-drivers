import * as fs from 'fs'
import * as S from 'sequelize'
const Sequelize = S as any

export const makeDb = config => {
  const { DB_DB, DB_USR, DB_PSW, DB_HOST, NODE_ENV } = config

  const dialectOptions =
    NODE_ENV === 'development'
      ? { ssl: true }
      : {
          ssl: {
            ca: fs.readFileSync('../ssl/karma-postgres-prod/server-ca.pem'),
            cert: fs.readFileSync('../ssl/karma-postgres-prod/client-cert.pem'),
            key: fs.readFileSync('../ssl/karma-postgres-prod/client-key.pem'),
          },
        }

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
    ssl: true,
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
