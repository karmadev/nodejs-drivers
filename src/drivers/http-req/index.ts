import axios from 'axios'
import * as t from './types'

export const httpReq: t.httpReq = args =>
  axios({
    method: args.method,
    url: args.url,
    data: args.body,
    headers: {
      Authorization: `Bearer ${args.authToken}`,
    },
  })
    .then(resp => resp.data)
    .catch(error => {
      return { success: false, error }
    })
