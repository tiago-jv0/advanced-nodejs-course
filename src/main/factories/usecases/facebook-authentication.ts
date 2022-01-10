import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/usecases'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAccount } from '@/main/factories/repositories'
import { makeJwtTokenGenerator } from '../crypto'
export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(makeFacebookApi(), makePgUserAccount(), makeJwtTokenGenerator())
}
