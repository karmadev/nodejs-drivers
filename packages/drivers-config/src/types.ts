export type IMakeFilterToPrefixed = (
  prefix: string
) => ([key, _]: [string, any]) => boolean

export type IReduceToConfigObject = (
  accumulator: { [key: string]: string },
  [key, val]: [string, string]
) => { [key: string]: string }

export type IMapToNoPrefix = (
  prefix: string
) => ([key, val]: [string, string]) => [string, string]

export interface IConfigArgs {
  prefix: string
  envVars: {
    [s: string]: string | undefined
  }
}

// @TODO: Implement better type safety. We need to add io-ts to do a runtime validation.
// export type IConfig<K extends string> = { [P in K]: string }

export interface IConfig {
  [s: string]: string
}

export type IMakeConfig = (args: IConfigArgs) => IConfig
