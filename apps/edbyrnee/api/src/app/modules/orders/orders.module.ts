import { Module } from '@nestjs/common';
import { StripeModule } from 'nestjs-stripe';
import { DatabaseModule } from '../../core/database/database.module';
import { SequelizeUow } from '../../core/database/infra/sequelize-uow';
import { AuthModule } from '../auth/auth.module';
import { DropsModule } from '../drops/drops.module';
import { OrdersController } from './orders.controller';
import { ordersProviders } from './orders.providers';
import { OrderService } from './orders.service';
@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    DropsModule,
    StripeModule.forRoot({
      apiKey:
        process.env.STRIPE_API_KEY,
      apiVersion: '2022-11-15',
    }),
  ],
  controllers: [OrdersController],
  providers: [...ordersProviders, OrderService, SequelizeUow],
  exports: [],
})
export class OrdersModule {}
