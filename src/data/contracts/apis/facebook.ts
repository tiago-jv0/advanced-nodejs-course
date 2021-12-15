
export interface LoadFacebookUserApi {
  loadUserByToken: (token: LoadFacebookUserApi.Params) => Promise<LoadFacebookUserApi.Result>
}

export namespace LoadFacebookUserApi {
  export type Params = {
    token: string
  }

  export type Result = undefined
}
