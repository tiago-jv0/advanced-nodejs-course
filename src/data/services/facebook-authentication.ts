import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '@/data/contracts/cypto'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookData = await this.facebookApi.loadUser(params)

    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email })
      const facebookAccount = new FacebookAccount(facebookData, accountData)
      const { id } = await this.userAccountRepository.saveWithFacebook(facebookAccount)
      await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
    }
    return new AuthenticationError()
  }
}
