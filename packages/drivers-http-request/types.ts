export interface IArgs {
  method: string
  url: string
  body: any
  authToken: string
}

export type httpReq = (args: IArgs) => Promise<any>
