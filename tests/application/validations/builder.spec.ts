import { RequiredStringValidator, ValidationBuilder } from '@/application/validations'

describe('ValidationBuilder', () => {
  it('should return a RequiredStringValidator', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', field: 'any_field' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredStringValidator('any_field', 'any_value')])
  })
})
