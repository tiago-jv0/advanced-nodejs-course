import { LoadUserAccountRepository } from '@/data/contracts/repositories'

import { IBackup, newDb } from 'pg-mem'

import { Entity, PrimaryGeneratedColumn, Column, getRepository, Repository, getConnection } from 'typeorm'

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepository = getRepository(PgUser)

    const pgUser = await pgUserRepository.findOne({ email: params.email })

    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }

    return undefined
  }
}

@Entity({ name: 'users' })
class PgUser {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ nullable: true })
  facebookId?: string
}

describe('PgUserAccountRepository', () => {
  describe('Load', () => {
    let sut: PgUserAccountRepository
    let pgUserRepository: Repository<PgUser>
    let backup: IBackup
    beforeAll(async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })

      await connection.synchronize()
      backup = db.backup()

      pgUserRepository = getRepository(PgUser)
    })

    afterAll(async () => {
      await getConnection().close()
    })

    beforeEach(() => {
      backup.restore()

      sut = new PgUserAccountRepository()
    })

    it('should return an account if email exists', async () => {
      await pgUserRepository.save({ email: 'any_email' })

      const account = await sut.load({ email: 'any_email' })

      expect(account).toEqual({
        id: '1'
      })
    })

    it('should return undefined if email does not exist', async () => {
      const account = await sut.load({ email: 'any_email' })

      expect(account).toEqual(undefined)
    })
  })
})
