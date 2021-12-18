
export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    name?: string
    id: string
  }
}

export interface SaveFacebookAccountRepository {
  saveWithFacebook: (params: SaveFacebookAccountRepository.Params) => Promise<void>
}

export namespace SaveFacebookAccountRepository {
  export type Params = {
    email: string
    name: string
    facebookId: string
    id?: string
  }
}
