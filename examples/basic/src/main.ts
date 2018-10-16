import { IDeps, IApp } from './types'

function close() {
  return Promise.resolve()
}

export function main(deps: IDeps): IApp {
  return {
    close,
  }
}
