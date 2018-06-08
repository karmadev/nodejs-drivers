import * as Sequelize from 'sequelize'

export const makeDb = config => {
  const { DB_DB, DB_USR, DB_PSW, DB_HOST } = config

  const db = new Sequelize(DB_DB, DB_USR, DB_PSW, {
    dialect: 'postgres',
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
