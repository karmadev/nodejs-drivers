export interface IDbMigratorConfig {
  host: string
  user: string
  password: string
  database: string
  serverCa?: string
  clientCert?: string
  clientKey?: string
  sslMode: 'off' | 'no-cert' | 'cert'
  directory: string
  migrationsTableName: string
}

export interface IContext {
  cid: string
}

export interface IDbMigrator {
  /** Rollback to previous migration and log the version. */
  rollback(context: IContext): Promise<string>
  /** Migrate to latest migration and log the version. */
  migrate(context: IContext): Promise<string>
  /** Delete all DB rows in the named table. */
  unseed(context: IContext, tableName: string): Promise<void>
  /** Will unlock the migrations lock. This is needed if the service crashes before unlocking it after a migration. */
  undoMigrationLock(context: IContext): Promise<void>
  /** Close the connection */
  close(): Promise<void>
}
