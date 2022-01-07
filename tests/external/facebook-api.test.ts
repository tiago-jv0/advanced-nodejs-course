import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'
describe('FacebookApi Integration Tests', () => {
  it('should return a Facebook User if token is valid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)

    const facebookUser = await sut.loadUser({ token: 'EAAZAsqZBtFxpMBAA8C15ZAjs4fIGHTv72wu7qKIKuneISzHOajAUHlPh9p3fynjULyQLHwUoUGOFSZAUF12HaTYqJK2hJAZCMok7d0SxF4hZCs6Vl3LEmgH8GOCo2CWD6wZAOI38Qxer5IZBecfltbZAsW7vnZB24S87RxyaogbioALlTymJ5xiXGZBGVTaRM1tVddCgcGD3lTWawZDZD' })

    expect(facebookUser).toEqual({
      facebookId: '101929949051065',
      email: 'tiago_giizyue_teste@tfbnw.net',
      name: 'Tiago Teste'
    })
  })

  it('should return undefined if token is invalid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)

    const facebookUser = await sut.loadUser({ token: 'invalid_token' })

    expect(facebookUser).toBeUndefined()
  })
})
