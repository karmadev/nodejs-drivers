export interface IDbConfig {
  DB_DB: string
  DB_USR: string
  DB_PSW: string
  DB_HOST: string
  SERVER_CA: string
  CLIENT_CERT: string
  CLIENT_KEY: string
}

export interface ISequelizeMock {
  close(): Promise<void>
  query(sql: string, options: { type: string; bind: any }): Promise<any>
}

export interface IDb {
  close(): Promise<void>
  exec<T>(sql: string, options: { type: string; bind: any }): Promise<T>
}
