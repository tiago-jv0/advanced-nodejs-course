import { TokenGenerator } from '@/data/contracts/cypto'

import { sign } from 'jsonwebtoken'

type Params = TokenGenerator.Params
type Result = TokenGenerator.Result

export class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secretKey: string) {}

  async generateToken ({ expirationInMs, key }: Params): Promise<Result> {
    const expirationInSeconds = expirationInMs / 1000

    const token = sign({ key }, this.secretKey, { expiresIn: expirationInSeconds })

    return token
  }
}
