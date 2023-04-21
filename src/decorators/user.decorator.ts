import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//Decorateur récupérable via  @GETUser
export const GETUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    //recupere le request
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);