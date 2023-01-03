import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
            }),
        );

        await app.init();
        await app.listen(3334);
        pactum.request.setBaseUrl('http://localhost:3334');

        prisma = app.get(PrismaService);
        await prisma.cleanDb();
    });

    afterAll(() => {
        app.close();
    });

    describe('Auth', () => {
        const dto: AuthDto = {
            email: 'dummy@mail.de',
            password: 'secret',
        };

        describe('Signup', () => {
            it('should throw exception if email is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({
                        password: dto.password,
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });
            it('should throw exception if password is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({
                        email: dto.email,
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });
            it('should throw exception if no body is provided', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });
            it('should signup', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody(dto)
                    .expectStatus(HttpStatus.CREATED);
            });
        });
        describe('Signin', () => {
            it('should throw exception if email is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody({
                        password: dto.password,
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });
            it('should throw exception if password is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody({
                        email: dto.email,
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });
            it('should throw exception if no body is provided', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });
            it('should signin', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody(dto)
                    .expectStatus(HttpStatus.OK)
                    .stores('userAccessToken', 'access_token'); // stored for later use
            });
        });
    });

    describe('Users', () => {
        describe('Get me', () => {
            it('should return current user', () => {
                return pactum
                    .spec()
                    .get('/users/me')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAccessToken}', // using value from store
                    })
                    .expectStatus(HttpStatus.OK);
            });
        });
        describe('Edit me', () => {
            it('should edit current user', () => {
                const dto: EditUserDto = {
                    email: 'stephan.goertz@gmail.com',
                    firstName: 'Stephan',
                };
                return pactum
                    .spec()
                    .patch('/users/me')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAccessToken}',
                    })
                    .withBody(dto)
                    .expectStatus(HttpStatus.OK)
                    .expectBodyContains(dto.email)
                    .expectBodyContains(dto.firstName);
            });
        });
    });

    describe('Bookmarks', () => {
        describe('Get empty list', () => {
            it('should get empty list', () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAccessToken}',
                    })
                    .expectStatus(HttpStatus.OK)
                    .expectBody([]);
            });
        });
        describe('Create', () => {
            it('should create bookmark', () => {
                const dto: CreateBookmarkDto = {
                    title: 'first bookmark',
                    link: 'https://www.google.de',
                };
                return pactum
                    .spec()
                    .post('/bookmarks')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAccessToken}',
                    })
                    .withBody(dto)
                    .expectStatus(HttpStatus.CREATED)
                    .stores('bookmarkId', 'id');
            });
        });
        describe('Get all', () => {
            it('should get bookmarks', () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAccessToken}',
                    })
                    .expectStatus(HttpStatus.OK)
                    .expectJsonLength(1);
            });
        });
        describe('Get by id', () => {
            it('should get bookmark by id', () => {
                return pactum
                    .spec()
                    .get('/bookmarks/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAccessToken}',
                    })
                    .expectStatus(HttpStatus.OK)
                    .expectBodyContains('$S{bookmarkId}');
                // .inspect()
            });
        });
        describe('Edit by id', () => {
            it('should edit bookmark', () => {
                const dto: EditBookmarkDto = {
                    description: 'cool framework for server-side apps',
                    link: 'https://www.nestjs.com',
                };
                return pactum
                    .spec()
                    .patch('/bookmarks/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAccessToken}',
                    })
                    .withBody(dto)
                    .expectStatus(HttpStatus.OK)
                    .expectBodyContains(dto.description)
                    .expectBodyContains(dto.link);
            });
        });
        describe('Delete by id', () => {
            it('should delete bookmark', () => {
                return pactum
                    .spec()
                    .delete('/bookmarks/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAccessToken}',
                    })
                    .expectStatus(HttpStatus.NO_CONTENT);
            });

            it('should get empty list after deletion', () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAccessToken}',
                    })
                    .expectStatus(HttpStatus.OK)
                    .expectBody([]);
            });
        });
    });
});
