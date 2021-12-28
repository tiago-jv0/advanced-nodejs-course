
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repositories'
import { PgUser } from '@/infra/postgres/entities'

import { getRepository } from 'typeorm'

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly pgUserRepository = getRepository(PgUser)

  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepository.findOne({ email: params.email })

    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }

    return undefined
  }

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    let id: string

    if (params.id === undefined) {
      const pgUser = await this.pgUserRepository.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      })

      id = pgUser.id.toString()
    } else {
      id = params.id
      await this.pgUserRepository.update({
        id: parseInt(params.id)
      }, {
        name: params.name,
        facebookId: params.facebookId
      })
    }
    return { id: id.toString() }
  }
}
