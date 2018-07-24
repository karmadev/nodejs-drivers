export type makeFilterToPrefixed = (
  prefix: string
) => ([key, _]: [string, {}]) => boolean

export type makeFilterToPopulatedValues = (
  removeToken: string
) => ([key, val]: [string, string]) => boolean

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
  removeToken: string
  envVars: {
    [s: string]: string
  }
}

export interface IConfig {
  [s: string]: string
}

export type makeConfig = (args: IConfigArgs) => IConfig
