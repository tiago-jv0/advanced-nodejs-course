import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { Controller } from '@/application/controllers'
import { mock } from 'jest-mock-extended'
class ExpressRouter {
  constructor (private readonly controller: Controller) {}

  async adapt (request: Request, response: Response): Promise<void> {
    await this.controller.handle({
      ...request.body
    })
  }
}

describe('Express Router', () => {
  it('should call handle with correct request', async () => {
    const request = getMockReq({
      body: {
        any: 'any'
      }
    })
    const { res: response } = getMockRes()
    const controller = mock<Controller>()
    const sut = new ExpressRouter(controller)

    await sut.adapt(request, response)

    expect(controller.handle).toHaveBeenCalledWith({
      any: 'any'
    })
  })
})
