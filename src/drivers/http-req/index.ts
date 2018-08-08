import axios from 'axios'

interface IArgs {
  method: string
  url: string
  body: any
  authToken: string
}

export const httpReq = (args: IArgs) =>
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
