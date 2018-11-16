import * as Knex from 'knex'
import { Subject } from 'rxjs'
import { IDbMigrator, IDbMigratorConfig, IContext } from './types'

export class DbMigrator implements IDbMigrator {
  private knex: Knex
  private config: IDbMigratorConfig
  private infoLogStream: Subject<any>

  constructor(config: IDbMigratorConfig) {
    this.config = config
    this.infoLogStream = new Subject<any>()
    this.knex = makeKnexConnection(config)
  }

  public async rollback(context: IContext): Promise<string> {
    await Promise.resolve(
      this.knex.migrate.rollback({ directory: this.config.directory })
    )

    const result = await this.knex.migrate.currentVersion({
      directory: this.config.directory,
    })

    this.infoLogStream.next({
      level: 'info',
      message: `rolled back to version <${result}>.`,
      cid: context.cid,
    })

    return result
  }

  public async migrate(context: IContext): Promise<string> {
    await Promise.resolve(
      this.knex.migrate.latest({ directory: this.config.directory })
    )

    const result = await this.knex.migrate.currentVersion({
      directory: this.config.directory,
    })

    this.infoLogStream.next({
      level: 'info',
      message: `Migrated to latest version <${result}>.`,
      cid: context.cid,
    })

    return result
  }

  public async unseed(context: IContext, tableName: string): Promise<void> {
    await Promise.resolve(this.knex.delete().from(tableName))

    this.infoLogStream.next({
      level: 'info',
      message: `Deleted all events from the <${tableName}> table.`,
      cid: context.cid,
    })

    return
  }

  public undoMigrationLock(context: IContext): Promise<void> {
    const lockTableName = `${this.config.migrationsTableName}_lock`

    return Promise.resolve(
      this.knex
        .update({ is_locked: 0 })
        .from(lockTableName)
        .then(() => {
          this.infoLogStream.next({
            level: 'info',
            message: `The migration lock is now reset to unlocked for table <${lockTableName}>.`,
            cid: context.cid,
          })
          return
        })
    )
  }

  public close(): Promise<void> {
    return Promise.resolve(this.knex.destroy())
  }
}

function makeKnexConnection(config: IDbMigratorConfig) {
  const knexOptions: any = {
    client: 'pg',
    connection: {
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
    },
    migrations: {
      tableName: config.migrationsTableName,
    },
  }

  if (config.sslMode === 'no-cert') {
    knexOptions.connection.ssl = true
  } else if (config.sslMode === 'cert') {
    knexOptions.connection.ssl = {
      ca: Buffer.from(`${config.serverCa}`, 'base64').toString('ascii'),
      cert: Buffer.from(`${config.clientCert}`, 'base64').toString('ascii'),
      key: Buffer.from(`${config.clientKey}`, 'base64').toString('ascii'),
    }
  }

  return Knex(knexOptions)
}
