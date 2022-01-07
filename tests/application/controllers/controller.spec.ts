import { Controller } from '@/application/controllers'
import { ServerError } from '@/application/errors'
import { HttpResponse } from '@/application/helpers'
import { ValidationComposite } from '@/application/validations'

import { mocked } from 'ts-jest/utils'

jest.mock('@/application/validations/composite')

class ControllerStub extends Controller {
  async perform (httpRequest: any): Promise<HttpResponse<any>> {
    const result: HttpResponse<string> = {
      statusCode: 200,
      data: 'any_data'
    }
    return Promise.resolve(result)
  }
}

describe('Controller', () => {
  let sut: ControllerStub

  beforeEach(() => {
    sut = new ControllerStub()
  })

  it('should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValue(error)
    }))

    mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
    expect(ValidationComposite).toHaveBeenCalledWith([])
  })

  it('should return 500 if perform throws', async () => {
    const error = new Error('perform_error')

    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  it('should return same result as perform', async () => {
    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: 'any_data'
    })
  })
})
