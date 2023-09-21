import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class FakeJwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    req.user = {
      uuid: 'test-uuid',
    };

    return true;
  }
}
