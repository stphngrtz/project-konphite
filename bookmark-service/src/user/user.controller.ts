import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@Controller('users')
export class UserController {

    @Get('me')
    @UseGuards(JwtGuard)
    getMe(@User() user: any) { // also possible: @User('email') email: string
        return user;
    }
}
