
export interface HttpGetClient {
  get: <ResultType = any> (params: HttpGetClient.Params) => Promise<ResultType>
}

export namespace HttpGetClient {
  export type Params = {
    url: string
    params: object
  }

}
