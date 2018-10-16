export interface IDeps {
  config: { [s: string]: string }
}

export interface IApp {
  close(): Promise<void>
}
