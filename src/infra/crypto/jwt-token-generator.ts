import { TokenGenerator } from '@/data/contracts/cypto'

import { sign } from 'jsonwebtoken'

export class JwtTokenGenerator {
  constructor (private readonly secretKey: string) {}

  async generateToken (params: TokenGenerator.Params): Promise<string> {
    const expirationInSeconds = params.expirationInMs / 1000

    const token = sign({ key: params.key }, this.secretKey, { expiresIn: expirationInSeconds })

    return token
  }
}
