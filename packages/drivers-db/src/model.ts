import * as Sequelize from 'sequelize'
import { IDb, IDbConfig, ISequelizeMock } from './types'

function toDialectOptions(config: IDbConfig): { ssl: any } {
  const result: { ssl: any } = config.SERVER_CA
    ? {
        ssl: {
          ca: new Buffer(config.SERVER_CA, 'base64').toString('ascii'),
          cert: new Buffer(config.CLIENT_CERT, 'base64').toString('ascii'),
          key: new Buffer(config.CLIENT_KEY, 'base64').toString('ascii'),
        },
      }
    : { ssl: true }
  return result
}

function makeSequelize(config: IDbConfig): Sequelize.Sequelize {
  return new Sequelize(config.DB_DB, config.DB_USR, config.DB_PSW, {
    dialect: 'postgres',
    dialectOptions: toDialectOptions(config),
    host: config.DB_HOST,
    logging: false,
    pool: {
      idle: 10000,
      max: 5,
      min: 0,
    },
  })
}

function makeSequelizeMock(results: any[][]): ISequelizeMock {
  let cursor = 0
  return {
    close: () => Promise.resolve(),
    query: (sql: string, options: { type: string; bind: any }) =>
      Promise.resolve(results[cursor++]),
  }
}

export class Db implements IDb {
  private sequelize: Sequelize.Sequelize | ISequelizeMock

  constructor(
    config: IDbConfig,
    isMocked: boolean = false,
    mockResults: any[][] = [[]]
  ) {
    if (isMocked) {
      this.sequelize = makeSequelizeMock(mockResults)
    } else {
      this.sequelize = makeSequelize(config)
    }
  }

  public close(): Promise<void> {
    return Promise.resolve(this.sequelize.close())
  }

  public exec<T>(
    sql: string,
    options: { type: string; bind: any }
  ): Promise<T> {
    return Promise.resolve<T>((this.sequelize.query as any)(sql, options))
  }
}
