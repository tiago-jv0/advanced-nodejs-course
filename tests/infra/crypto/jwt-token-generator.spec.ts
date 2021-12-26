import { TokenGenerator } from '@/data/contracts/cypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

class JwtTokenGenerator {
  constructor (private readonly secretKey: string) {}

  async generateToken (params: TokenGenerator.Params): Promise<void> {
    const expirationInSeconds = params.expirationInMs / 1000

    jwt.sign({ key: params.key }, this.secretKey, { expiresIn: expirationInSeconds })
  }
}

describe('JwtTokenGenerator', () => {
  it('Should sign with correct params', async () => {
    const sut = new JwtTokenGenerator('any_secret')
    const fakeJwt = jwt as jest.Mocked<typeof jwt>

    await sut.generateToken({ key: 'any_key', expirationInMs: 1000 })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
  })
})
