export class AccessToken {
  static get expirationInMs (): number {
    return 30 * 60 * 1000
  }

  constructor (readonly value: string) {}
}
