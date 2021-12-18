import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repositories'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository>
  const token = 'any_token'

  beforeEach(() => {
    facebookApi = mock<LoadFacebookUserApi>()
    userAccountRepository = mock<LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository>()
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

  it('should call CreateFacebookAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    await sut.perform({ token })

    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({ name: 'any_fb_name', email: 'any_fb_email', facebookId: 'any_fb_id' })
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call UpdateFacebookAccountRepository when LoadUserAccountRepository returns data', async () => {
    userAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })

    await sut.perform({ token })

    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should update account name', async () => {
    userAccountRepository.load.mockResolvedValueOnce({ id: 'any_id' })

    await sut.perform({ token })

    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledTimes(1)
  })
})
