import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repositories'

import { IBackup } from 'pg-mem'
import { getRepository, Repository, getConnection } from 'typeorm'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let pgUserRepository: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser])
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

  describe('Load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepository.save({ email: 'any_email' })

      const account = await sut.load({ email: 'any_email' })

      expect(account).toEqual({
        id: '1'
      })
    })

    it('should return undefined if email does not exist', async () => {
      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })

  describe('SaveWithFacebook', () => {
    it('should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({ email: 'any_email', name: 'any_name', facebookId: 'any_fb_id' })

      const pgUser = await pgUserRepository.findOne({ email: 'any_email' })

      expect(pgUser?.id).toBe(1)
      expect(id).toBe('1')
    })

    it('should update an account if id is defined', async () => {
      await pgUserRepository.save({ email: 'any_email', name: 'any_name', facebookId: 'any_fb_id' })

      const { id } = await sut.saveWithFacebook({ id: '1', email: 'new_email', name: 'new_name', facebookId: 'new_fb_id' })

      const pgUser = await pgUserRepository.findOne({ id: 1 })

      expect(pgUser).toEqual({ id: 1, email: 'any_email', name: 'new_name', facebookId: 'new_fb_id' })
      expect(id).toBe('1')
    })
  })
})
