import CustomError from '../errors/CustomError';
import { EHttpStatusCode } from '../interface/interface';
import { TUserRole } from '../modules/user/user.interface';
import catchAsync from '../utils/catchAsync';

const authorizationRole = (...requiredRoles: TUserRole[]) => {
  console.log(requiredRoles);
  return catchAsync(async (req, res, next) => {
    if (requiredRoles && req?.user && !requiredRoles.includes(req.user.role)) {
      throw new CustomError(
        EHttpStatusCode.FORBIDDEN,
        'UNAUTHENTICATED Access.',
        true,
        [],
      );
    }
    next();
  });
};

export default authorizationRole;
