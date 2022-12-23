import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    getMe(@User() user: any) { // also possible: @User('email') email: string
        return user;
    }

    @Patch('me')
    editUser(@User('id') id: number, @Body() dto: EditUserDto) {
        return this.userService.editUser(id, dto);
    }
}
