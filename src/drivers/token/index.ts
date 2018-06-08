import * as uuidV4 from 'uuid/v4'

export const makeToken = config => {
  const tokenEffect = () => Promise.resolve(uuidV4())
  return tokenEffect
}
