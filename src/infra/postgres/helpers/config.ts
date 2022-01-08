import { ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'kesavan.db.elephantsql.com',
  port: 5432,
  username: 'bychphpa',
  database: 'bychphpa',
  password: '81qmU9ltpPbMTBWewOITShCrteEmNy7p',
  entities: ['build/infra/postgres/entities/index.js']
}
