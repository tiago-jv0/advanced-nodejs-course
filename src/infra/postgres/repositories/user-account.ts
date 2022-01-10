
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repositories'
import { PgUser } from '@/infra/postgres/entities'

import { getRepository } from 'typeorm'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveParams = SaveFacebookAccountRepository.Params
type SaveResult = SaveFacebookAccountRepository.Result

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load ({ email }: LoadParams): Promise<LoadResult> {
    const pgUserRepository = getRepository(PgUser)
    const pgUser = await pgUserRepository.findOne({ email })

    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }

    return undefined
  }

  async saveWithFacebook ({ id, email, facebookId, name }: SaveParams): Promise<SaveResult> {
    const pgUserRepository = getRepository(PgUser)
    let resultId: string

    if (id === undefined) {
      const pgUser = await pgUserRepository.save({ email, name, facebookId })
      resultId = pgUser.id.toString()
    } else {
      resultId = id
      await pgUserRepository.update({ id: parseInt(id) }, { name, facebookId })
    }
    return { id: resultId.toString() }
  }
}
