export interface IDbConfig {
  /** The database name.  */
  DB_DB: string
  /** The user.  */
  DB_USR: string
  /** The password.  */
  DB_PSW: string
  /** The host.  */
  DB_HOST: string
  /** Base64 string for the CA.  */
  SERVER_CA: string
  /** Base64 string for the cert.  */
  CLIENT_CERT: string
  /** Base64 string for the key.  */
  CLIENT_KEY: string
}

export interface ISequelizeMock {
  close(): Promise<void>
  query(sql: string, options: { type: string; bind: any }): Promise<any>
}

export interface IDb {
  /** Closes the connection.  */
  close(): Promise<void>
  /** Executes the sql query and returns the result of type T. */
  exec<T>(sql: string, options: { type: string; bind: any }): Promise<T>
}
