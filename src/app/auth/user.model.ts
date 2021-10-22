export class User {
  constructor(public email: string, public id: string, private idToken: string, private expirationDate: Date) {
  }

  get token(): string | null {
    if (!this.expirationDate || new Date() > this.expirationDate) {
      return null;
    }
    return this.idToken;
  }
}
