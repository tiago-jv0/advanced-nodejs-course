
import { FacebookApi } from '@/infra/apis'
import { HttpGetClient } from '@/infra/http'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookApi', () => {
  let httpGetClient: MockProxy<HttpGetClient>
  let clientId: string
  let clientSecret: string
  let sut: FacebookApi

  beforeAll(() => {
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'

    httpGetClient = mock<HttpGetClient>()
  })

  beforeEach(() => {
    httpGetClient.get
      .mockResolvedValueOnce({ access_token: 'any_app_token' })
      .mockResolvedValueOnce({ data: { user_id: 'any_user_id' } })
      .mockResolvedValueOnce({ id: 'any_fb_id', name: 'any_fb_name', email: 'any_fb_email' })

    sut = new FacebookApi(httpGetClient, clientId, clientSecret)
  })

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpGetClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })

  it('should get debug token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpGetClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })

  it('should get user info', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpGetClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id',
      params: {
        fields: 'id,name,email',
        access_token: 'any_client_token'
      }
    })
  })

  it('should return facebook user', async () => {
    const facebookUser = await sut.loadUser({ token: 'any_client_token' })

    expect(facebookUser).toEqual({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    })
  })

  it('should return undefined if http get client throws', async () => {
    httpGetClient.get.mockReset().mockRejectedValueOnce(new Error('facebook_error'))

    const facebookUser = await sut.loadUser({ token: 'any_client_token' })

    expect(facebookUser).toBeUndefined()
  })
})
