import { UserType } from 'src/iam/authorization/enums/user-type.enum';

export type JwtPayload = {
  sub: number;
  email: string;
  userType: UserType;
  refreshTokenId?: string;
};
