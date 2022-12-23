import { ForbiddenException, Injectable } from '@nestjs/common';
import { bindCallback, using } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prismaService: PrismaService) {}

    async createBookmark(userId: number, dto: CreateBookmarkDto) {
        const bookmark = await this.prismaService.bookmark.create({
            data: {
                userId: userId,
                ...dto
            }
        });
        return bookmark;
    }

    getBookmarks(userId: number) {
        return this.prismaService.bookmark.findMany({
            where: {
                userId: userId
            }
        });
    }

    getBookmarkById(userId: number, bookmarkId: number) {
        return this.prismaService.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId: userId
            }
        });
    }

    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        const bookmark = await this.prismaService.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        });

        if (!bookmark || bookmark.userId !== userId)
            throw new ForbiddenException('Access to resource denied');
        
        return this.prismaService.bookmark.update({
            where: {
                id: bookmarkId
            },
            data: {
                ...dto
            }
        });
    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        const bookmark = await this.prismaService.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        });

        if (!bookmark || bookmark.userId !== userId)
            throw new ForbiddenException('Access to resource denied');

        await this.prismaService.bookmark.delete({
            where: {
                id: bookmarkId
            }
        })
    }
}
