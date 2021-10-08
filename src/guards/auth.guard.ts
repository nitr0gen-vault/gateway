import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SecretAuth } from '../auth/secret.auth';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.getArgByIndex(0);
    const api = ctx.headers['x-api-key'] as string;

    if (api) {
      const [app, secret] = api.split('.');
      ctx.app = {
        id: app,
      };
      return SecretAuth.isAuthenticated(app, secret);
    } else {
      const app = ctx.headers.app;
      const secret = ctx.headers.secret;
      ctx.app = {
        id: app,
      };
      return SecretAuth.isAuthenticated(app, secret);
    }
  }
}
