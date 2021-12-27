import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'users' })
export class PgUser {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ nullable: true })
  facebookId?: string
}
