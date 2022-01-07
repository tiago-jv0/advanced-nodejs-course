import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validations'
import { Controller } from '@/application/controllers'

type HttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  async perform (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token })

    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized()
  }

  buildValidators (httpRequest: HttpRequest): Validator[] {
    return ValidationBuilder.of({ field: 'token', value: httpRequest.token }).required().build()
  }
}
