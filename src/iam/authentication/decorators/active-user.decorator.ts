import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Librarian, Reader } from '@prisma/client';
import { Request } from 'express';

export const ACTIVE_User_KEY = 'user';

export const ActiveUser = createParamDecorator((context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>();
  const user: Reader | Librarian = request[ACTIVE_User_KEY];
  return user;
});
