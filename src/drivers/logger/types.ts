export interface IEntryMeta {
  [key: string]: any
}

export interface ILogger {
  debug(message: string, meta?: IEntryMeta): void
  info(message: string, meta?: IEntryMeta): void
  warning(message: string, meta?: IEntryMeta): void
  error(message: string, meta?: IEntryMeta): void
  eventError(entity: string, method: string, meta?: IEntryMeta): void
  eventInfo(entity: string, method: string, meta?: IEntryMeta): void
}
