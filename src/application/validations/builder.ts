import { RequiredStringValidator, Validator } from '@/application/validations'

export class ValidationBuilder {
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
