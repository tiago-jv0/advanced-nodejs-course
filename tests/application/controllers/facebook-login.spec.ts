import { FacebookLoginController } from '@/application/controllers'
import { ServerError, UnauthorizedError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validations'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuthentication: MockProxy<FacebookAuthentication>
  let token: string

  beforeAll(() => {
    facebookAuthentication = mock<FacebookAuthentication>()
    facebookAuthentication.perform.mockResolvedValue(new AccessToken('any_value'))

    token = 'any_token'
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuthentication)
  })

  it('should return build Validators correctly', async () => {
    const validators = await sut.buildValidators({ token })

    expect(validators).toEqual([new RequiredStringValidator('token', 'any_token')])
  })

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token })

    expect(facebookAuthentication.perform).toHaveBeenCalledWith({ token })
    expect(facebookAuthentication.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication fails', async () => {
    facebookAuthentication.perform.mockResolvedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })

  it('should return 500 if authentication throws', async () => {
    const error = new Error('infra_error')

    facebookAuthentication.perform.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
