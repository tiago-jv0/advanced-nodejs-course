import { RequiredStringValidator, Validator } from '@/application/validations'

class ValidationBuilder {
  private readonly validators: Validator[] = []

  private constructor (
    private readonly field: string,
    private readonly value: string
  ) {}

  static of (params: { field: string, value: string}): ValidationBuilder {
    return new ValidationBuilder(params.field, params.value)
  }

  required (): ValidationBuilder {
    this.validators.push(new RequiredStringValidator(this.field, this.value))
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}

describe('ValidationBuilder', () => {
  it('should return a RequiredStringValidator', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', field: 'any_field' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredStringValidator('any_field', 'any_value')])
  })
})
