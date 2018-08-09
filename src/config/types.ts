export type makeFilterToPrefixed = (
  prefix: string
) => ([key, _]: [string, {}]) => boolean

export type reduceToConfigObject = (
  accumulator: {},
  [key, val]: [string, boolean | string]
) => {}

export type mapToBoolOrId = (
  [key, value]: [string, string]
) => [string, boolean | string]

export type mapToNoPrefix = (
  prefix: string
) => ([key, val]: [string, boolean | string]) => [string, boolean | string]

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
