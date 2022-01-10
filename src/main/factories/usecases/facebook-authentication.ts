import { FacebookAuthenticationUseCase } from '@/domain/usecases'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAccount } from '@/main/factories/repositories'
import { makeJwtTokenGenerator } from '../crypto'
export const makeFacebookAuthentication = (): FacebookAuthenticationUseCase => {
  return new FacebookAuthenticationUseCase(makeFacebookApi(), makePgUserAccount(), makeJwtTokenGenerator())
}
