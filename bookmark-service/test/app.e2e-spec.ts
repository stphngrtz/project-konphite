import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { AuthDto } from 'src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));

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
      password: 'secret'
    };

    describe('Signup', () => {
      it('should throw exception if email is empty', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw exception if password is empty', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw exception if no body is provided', () => {
        return pactum.spec()
          .post('/auth/signup')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should signup', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED);
      });
    });
    describe('Signin', () => {
      it('should throw exception if email is empty', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw exception if password is empty', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw exception if no body is provided', () => {
        return pactum.spec()
          .post('/auth/signin')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should signin', () => {
        return pactum.spec()
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
        return pactum.spec()
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}' // using value from store
          })
          .get('/users/me')
          .expectStatus(HttpStatus.OK);
      });
    });
    describe('Edit me', () => {
    
    });
  });

  describe('Bookmarks', () => {
    describe('Create', () => {
    
    });
    describe('Get all', () => {
    
    });
    describe('Get by id', () => {
    
    });
    describe('Edit by id', () => {
    
    });
    describe('Delete by id', () => {
    
    });
  });
});