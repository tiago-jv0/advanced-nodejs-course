import { FacebookAccount } from '@/domain/models'

describe('Facebook Account', () => {
  const facebookDataMock = {
    name: 'any_facebook_name',
    email: 'any_facebook_email',
    facebookId: 'any_facebook_id'
  }

  it('should create with facebook data only', () => {
    const sut = new FacebookAccount(facebookDataMock)

    expect(sut).toEqual(facebookDataMock)
  })

  it('should update name if is empty', () => {
    const accountDataMock = {
      id: 'any_account_id'
    }

    const sut = new FacebookAccount(facebookDataMock, accountDataMock)

    expect(sut).toEqual({ id: 'any_account_id', ...facebookDataMock })
  })

  it('should not update name if its not empty', () => {
    const accountDataMock = {
      id: 'any_account_id',
      name: 'any_account_name'
    }

    const sut = new FacebookAccount(facebookDataMock, accountDataMock)

    expect(sut).toEqual({ ...facebookDataMock, ...accountDataMock })
  })
})
