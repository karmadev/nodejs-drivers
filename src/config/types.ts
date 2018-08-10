export type makeFilterToPrefixed = (
  prefix: string
) => ([key, _]: [string, any]) => boolean

export type reduceToConfigObject = (
  accumulator: { [key: string]: string },
  [key, val]: [string, string]
) => { [key: string]: string }

export type mapToNoPrefix = (
  prefix: string
) => ([key, val]: [string, string]) => [string, string]

export interface IConfigArgs {
  prefix: string
  envVars: {
    [s: string]: string | undefined
  }
}

export interface IConfig {
  [s: string]: string
}

export type makeConfig = (args: IConfigArgs) => IConfig
