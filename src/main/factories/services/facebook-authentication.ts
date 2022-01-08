import { FacebookAuthenticationService } from '@/data/services'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAccount } from '@/main/factories/repositories'
import { makeJwtTokenGenerator } from '../crypto'
export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  return new FacebookAuthenticationService(makeFacebookApi(), makePgUserAccount(), makeJwtTokenGenerator())
}
