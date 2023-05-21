import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OrderService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../auth/utils/user.decorator';
import { RequestUser } from '../auth/utils/jwt.strategy';
import { DropService } from '../drops/drops.service';
import { ICreatePaymentIntentRequestBody } from '@shoppr-monorepo/api-interfaces';
import { AuthService } from '../auth/auth.service';
import { EmailService } from '../auth/email-service';
import { SequelizeUow } from '../../core/database/infra/sequelize-uow';
import { CreateMultiOrderDto } from './dto/create-multi-order.dto';
import { MultiOrder } from './entity/multi-order.entity';

@ApiTags('Orders')
@Controller('/orders')
export class OrdersController {
  private readonly Logger = new Logger(OrderService.name);

  constructor(
    private orderService: OrderService,
    private dropService: DropService,
    private authService: AuthService,
    private emailService: EmailService,
    private uow: SequelizeUow
  ) {}

  @ApiOperation({ summary: 'Assign a driver to an order' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Patch('/:orderUuid/assign-driver')
  async assignDriver(
    @User() user: RequestUser,
    @Param('orderUuid') orderUuid: string
  ): Promise<void> {
    return await this.uow.execute(async () => {
      return await this.orderService.assignDriver(orderUuid, user.uuid);
    });
  }

  @ApiOperation({ summary: 'Release order from the assigned driver' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Patch('/:orderUuid/release-driver')
  async releaseOrderFromDriver(@Param('orderUuid') orderUuid: string): Promise<void> {
    return await this.uow.execute(async () => {
      return await this.orderService.releaseOrderFromDriver(orderUuid);
    });
  }
  /* confirm order delivery endpoint */
  @ApiOperation({ summary: 'Confirm order delivery' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Patch('/:orderUuid/confirm-delivery')
  async confirmDelivery(
    @User() user: RequestUser,
    @Param('orderUuid') orderUuid: string
  ): Promise<void> {
    return await this.uow.execute(async () => {
      return await this.orderService.confirmDelivery(orderUuid);
    });
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Get('/deliveries')
  async getAllDeliveries(@User() user: RequestUser): Promise<MultiOrder[]> {
    return await this.uow.execute(async () => {
      return await this.orderService.getAllDeliveries();
    });
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Get('/')
  async getAllOrders(@User() user: RequestUser): Promise<MultiOrder[]> {
    return await this.uow.execute(async () => {
      return await this.orderService.getAllForUser(user.uuid);
    });
  }

  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Post('/')
  async createMultiOrder(
    @User() user: RequestUser,
    @Body() body: CreateMultiOrderDto
  ): Promise<void> {
    return await this.uow.execute(async () => {
      try {
        Logger.log(`Creating order for ${user.uuid}`, OrderService.name);
        const drops = await this.dropService.getDrops({
          uuid: body.dropUuids,
        });

        Logger.log(`Successfully returned ${drops.length} drops`);

        for (const drop of drops) {
          if (drop.qty_available <= 0) {
            throw new UnprocessableEntityException('Drop is out of stock');
          }
          await this.dropService.decrementDropQuantity(drop.uuid, 1);
        }

        await this.orderService.createMulti(user.uuid, drops, body);
        const multiOrder = await this.orderService.get(body.uuid);

        /* Some users placing an order may not have an email address */

        // await this.emailService.sendOrderConfirmationEmail(
        //   user.uuid,
        //   drops as any,
        //   body,
        //   multiOrder
        // );
      } catch (err) {
        Logger.error(err);
        throw new HttpException('Error creating order', 500);
      }
    });
  }

  @ApiOperation({ summary: 'Create a new payment intent' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Post('/payment-intent')
  async createPaymentIntent(@Body() body: ICreatePaymentIntentRequestBody) {
    return await this.uow.execute(async () => {
      Logger.log(`Payment intent request...`);
      return await this.orderService.createPaymentIntent(
        body.deliveryType,
        body.dropUuid,
        body.orderTotal
      );
    });
  }

  @ApiOperation({ summary: 'Get a single order' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Get('/:uuid')
  async getOrder(@Param('uuid') uuid: string): Promise<MultiOrder> {
    return await this.uow.execute(async () => {
      return await this.orderService.get(uuid);
    });
  }

  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Patch('/:uuid/status')
  async updateOrderStatus(
    @Param('uuid') uuid: string,
    @Body() body: any
  ): Promise<void> {
    return await this.uow.execute(async () => {
      return await this.orderService.updateOrderStatus(uuid, body.order_status);
    });
  }
}
