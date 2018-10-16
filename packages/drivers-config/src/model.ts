const makeFilterToPrefixed = (prefix: string) => ([key, _]: [
  string,
  any
]): boolean => key.startsWith(prefix)

function reduceToConfigObject(
  accumulator: { [key: string]: string },
  [key, val]: [string, string]
): { [key: string]: string } {
  return {
    ...accumulator,
    [key]: val,
  }
}

const mapToNoPrefix = (prefix: string) => ([key, val]: [string, string]): [
  string,
  string
] => [key.split(prefix)[1], val]

/**
 *
 * @param prefix All environment variables except NODE_ENV should be prefixed by some unique string.
 * This allows us to filter out not needed environment variables from the config object.
 * Example prefix: "KSALO_" or "MYAPP_".
 * @param envVars The environment variables, normally process.env unless running tests.
 * @returns An object with all the keys that had the `prefix` and aren't undefined. All keys have the prefix stripped.
 */
export function Config(
  prefix: string,
  envVars: {
    [s: string]: string | undefined
  }
): {
  [s: string]: string
} {
  const definedEnvVars: { [s: string]: string } = Object.entries(
    envVars
  ).reduce(
    (acc, [key, val]) => {
      if (typeof val !== 'undefined') {
        acc[key] = val
      }
      return acc
    },
    {} as {
      [s: string]: string
    }
  )

  return Object.entries(definedEnvVars)
    .filter(makeFilterToPrefixed(prefix))
    .map(mapToNoPrefix(prefix))
    .reduce(reduceToConfigObject, {})
}
