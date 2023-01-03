import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// see https://docs.nestjs.com/custom-decorators#custom-route-decorators
export const User = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        if (data) return request.user[data];
        else return request.user;
    },
);
