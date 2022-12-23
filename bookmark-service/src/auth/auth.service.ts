import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hash
                },
                // select: { id: true, email: true }
            });

            delete user.hash; // easy and dirty solution
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') { // https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
                throw new ForbiddenException('Credentials already taken')
            }
            throw error;
        }
    }

    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        if (!user)
            throw new ForbiddenException('Credentials incorrect');

        const pwMatches = await argon.verify(user.hash, dto.password);
        if (!pwMatches)
            throw new ForbiddenException('Credentials incorrect');

        delete user.hash;
        return user;
    }
}
