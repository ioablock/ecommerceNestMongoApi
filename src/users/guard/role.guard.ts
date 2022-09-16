import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { RequestWithUser } from '../schema/request-with-user';

import { Role } from '../schema/role.enum';

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      return user?.role === role;
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
