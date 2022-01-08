import { FacebookApi } from '@/infra/apis'
import { makeAxiosClient } from '@/main/factories/http'
import { env } from '@/main/config/env'
export const makeFacebookApi = (): FacebookApi => {
  return new FacebookApi(makeAxiosClient(), env.facebookApi.clientId, env.facebookApi.clientSecret)
}
