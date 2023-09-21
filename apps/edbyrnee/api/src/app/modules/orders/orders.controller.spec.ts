import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { OrdersController } from './orders.controller';
import { FakeJwtAuthGuard } from '../auth/utils/jwt-auth-guard.mock';
import configuration from '../auth/config';
import { OrderService } from './orders.service';
import { DropService } from '../drops/drops.service';
import { AuthService } from '../auth/auth.service';
const authConfig = configuration();

const ordersService = createMock<OrderService>();
const dropService = createMock<DropService>();
const authService = createMock<AuthService>();

describe('Orders', () => {
  let app: INestApplication;
  let server: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        // JwtModule.register({
        //   secret: authConfig.jwt.secret,
        //   signOptions: { expiresIn: authConfig.jwt.expiresIn },
        // }),
      ],
      providers: [
        // {
        //   provide: APP_GUARD,
        //   useValue: new FakeJwtAuthGuard(),
        // },
        {
          provide: OrderService,
          useValue: ordersService,
        },
        {
          provide: DropService,
          useValue: dropService,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
      controllers: [OrdersController],
    })
      // .useMocker(createMock)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
    console.log(`Server started...`);
  });

  it(`/POST orders`, () => {
    // Arrange
    console.log(`Testing POST /orders...`);
    // Assume
    expect(dropService.getDrop).not.toHaveBeenCalled();
    expect(authService.getProfile).not.toHaveBeenCalled();
    expect(ordersService.create).not.toHaveBeenCalled();
    // Act
    request(app.getHttpServer()).post('/orders').expect(123);
    // Assert
    expect(dropService.getDrop).toHaveBeenCalledTimes(1);
    expect(authService.getProfile).toHaveBeenCalledTimes(1);
    expect(ordersService.create).toHaveBeenCalledTimes(1);
  });

  afterAll(async () => {
    await app.close();
  });
});
