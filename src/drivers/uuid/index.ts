import * as _uuidV4 from 'uuid/v4'
import * as t from './types'

export const makeUuid: t.makeUuid = () => {
  const uuidV4 = () => Promise.resolve(_uuidV4())
  return uuidV4
}
