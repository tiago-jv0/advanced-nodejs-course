import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  const token = 'any_token'

  beforeEach(() => {
    facebookApi = mock<LoadFacebookUserApi>()
    userAccountRepository = mock<LoadUserAccountRepository & SaveFacebookAccountRepository>()
    facebookApi.loadUser.mockResolvedValue({ name: 'any_fb_name', email: 'any_fb_email', facebookId: 'any_fb_id' })

    userAccountRepository.load.mockResolvedValue(undefined)

    sut = new FacebookAuthenticationService(facebookApi, userAccountRepository)
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should create an account with facebook data', async () => {
    await sut.perform({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ name: 'any_fb_name', email: 'any_fb_email', facebookId: 'any_fb_id' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should not update account name', async () => {
    userAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })

    await sut.perform({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should update account name', async () => {
    userAccountRepository.load.mockResolvedValueOnce({ id: 'any_id' })

    await sut.perform({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
})
