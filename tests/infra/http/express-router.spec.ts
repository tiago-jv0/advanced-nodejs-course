import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { Controller } from '@/application/controllers'
import { mock, MockProxy } from 'jest-mock-extended'
class ExpressRouter {
  constructor (private readonly controller: Controller) {}

  async adapt (request: Request, response: Response): Promise<void> {
    const httpResponse = await this.controller.handle({
      ...request.body
    })

    response.status(httpResponse.statusCode).json(httpResponse.data)
  }
}

describe('Express Router', () => {
  let request: Request
  let response: Response
  let controller: MockProxy<Controller>
  let sut: ExpressRouter

  beforeEach(() => {
    request = getMockReq({
      body: {
        any: 'any'
      }
    })
    response = getMockRes().res
    controller = mock<Controller>()
    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: {
        data: 'any_data'
      }
    })
    sut = new ExpressRouter(controller)
  })

  it('should call handle with correct request', async () => {
    await sut.adapt(request, response)

    expect(controller.handle).toHaveBeenCalledWith({
      any: 'any'
    })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    const request = getMockReq()
    await sut.adapt(request, response)

    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should respond with 200 and valid data', async () => {
    await sut.adapt(request, response)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(
      { data: 'any_data' }
    )
    expect(response.status).toHaveBeenCalledTimes(1)
    expect(response.json).toHaveBeenCalledTimes(1)
  })
})
