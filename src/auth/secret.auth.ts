import * as apps from './apps.json';

export class SecretAuth {
  private static allowed: Allowed = apps;

  public static isAuthenticated(id: string, secret: string): boolean {
    return SecretAuth.allowed[id]
      ? SecretAuth.allowed[id].secret == secret
        ? true
        : false
      : false;
  }

  public getAuthenticated(id: string): Authenticated {
    return SecretAuth.allowed[id];
  }
}

interface Allowed {
  [id: string]: Authenticated;
}

interface Authenticated {
  secret: string;
  name: string;
}
