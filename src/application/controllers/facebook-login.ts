import { AccessToken } from '@/domain/entities'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validations'
import { Controller } from '@/application/controllers'
import { FacebookAuthentication } from '@/domain/usecases'

type HttpRequest = { token: string }

type Model = Error | { accessToken: string }

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication({ token })

    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized()
  }

  buildValidators ({ token }: HttpRequest): Validator[] {
    return ValidationBuilder.of({ field: 'token', value: token }).required().build()
  }
}
