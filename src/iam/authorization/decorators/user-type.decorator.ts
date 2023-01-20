import { SetMetadata } from '@nestjs/common';
import { UserType } from '../enums/user-type.enum';

export const USER_TYPE_KEY = 'USER_TYPE';
export const User = (...args: UserType[]) => SetMetadata(USER_TYPE_KEY, args);
