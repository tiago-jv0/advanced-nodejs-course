import { PgUserAccountRepository } from '@/infra/postgres/repositories'

export const makePgUserAccount = (): PgUserAccountRepository => {
  return new PgUserAccountRepository()
}
