import { Inject, Injectable, Logger } from '@nestjs/common';
import { IRepositoryPort } from '../../core/database/ports/repository-port';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entity/order.entity';
import { MULTI_ORDER_REPOSITORY, ORDERS_REPOSITORY } from './orders.providers';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { Drop } from '../drops/entities/drop.entity';
import {
  DeliveryMethod,
  DeliveryType,
  IDrop,
  OrderStatus,
} from '@shoppr-monorepo/api-interfaces';
import { UserProfile } from '../auth/entities/user-profile.entity';
import { CreateMultiOrderDto } from './dto/create-multi-order.dto';
import { MultiOrder } from './entity/multi-order.entity';
import { MultiOrderLine } from './entity/multi-order-line';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly orderRepo: IRepositoryPort<Order>,
    @Inject(ORDERS_REPOSITORY)
    private readonly multiOrderRepo: IRepositoryPort<MultiOrder>,
    @Inject(MULTI_ORDER_REPOSITORY)
    private readonly multiOrderLineRepo: IRepositoryPort<MultiOrderLine>,
    @InjectStripe() private readonly stripeClient: Stripe
  ) {}

  async createPaymentIntent(
    deliveryType: DeliveryType,
    dropUuid: string,
    orderTotal: number
  ) {
    Logger.log(`Creating payment intent for ${orderTotal}`, OrderService.name);
    const paymentIntent = await this.stripeClient.paymentIntents.create({
      amount: Math.round(orderTotal * 100),
      currency: 'gbp',
    });

    // WE NEED TO VALIDTE THE PAYMENT INTENT HERE !!

    Logger.log(`Created payment intent ${paymentIntent.id}`, OrderService.name);

    return paymentIntent;
  }

  calculateOrderTotal(deliveryType: DeliveryMethod, drop: Drop): number {
    let total = drop.price;

    switch (deliveryType) {
      case 'COLLECTION':
        total += 0;
        break;
      case 'LOCAL_DELIVERY':
        total += drop.localDeliveryCost;
        break;
      case 'NATIONAL_DELIVERY':
        total += drop.nationalDeliveryCost;
        break;
    }

    return total;
  }

  calculateMultiOrderTotal(deliveryCost: number, drops: Drop[]): number {
    let total = 0;

    for (const drop of drops) {
      total += drop.price;
    }
    return total + deliveryCost;
  }

  async create(
    currentUserUuid: string,
    drop: Drop,
    order: CreateOrderDto,
    maker: UserProfile
  ): Promise<void> {
    Logger.log(`Creating order`, OrderService.name);
    const newOrder = new Order();

    newOrder.uuid = order.uuid;
    newOrder.order_total = this.calculateOrderTotal(order.deliveryMethod, drop);
    newOrder.buyerUuid = currentUserUuid;
    newOrder.sellerUuid = drop.makerUuid;
    newOrder.order_status = 'OPEN';
    newOrder.dropUuid = drop.uuid;
    newOrder.dropName = drop.name;
    newOrder.makerName = maker.name;

    switch (order.deliveryMethod) {
      case 'LOCAL_DELIVERY':
        newOrder.deliveryMethod = 'LOCAL_DELIVERY';
        newOrder.deliveryAddressLine1 = order.deliveryAddressLine1;
        newOrder.deliveryAddressLine2 = order.deliveryAddressLine2;
        newOrder.deliveryAddressCity = order.deliveryAddressCity;
        newOrder.deliveryAddressPostcode = order.deliveryAddressPostcode;
        newOrder.deliveryAddressCountry = order.deliveryAddressCountry;
        break;
      case 'NATIONAL_DELIVERY':
        newOrder.deliveryMethod = 'NATIONAL_DELIVERY';
        newOrder.deliveryAddressLine1 = order.deliveryAddressLine1;
        newOrder.deliveryAddressLine2 = order.deliveryAddressLine2;
        newOrder.deliveryAddressCity = order.deliveryAddressCity;
        newOrder.deliveryAddressPostcode = order.deliveryAddressPostcode;
        newOrder.deliveryAddressCountry = order.deliveryAddressCountry;
        break;
      case 'COLLECTION':
        newOrder.deliveryMethod = 'COLLECTION';
        newOrder.collectionAddressLine1 = drop.collectionAddressLine1;
        newOrder.collectionAddressLine2 = drop.collectionAddressLine2;
        newOrder.collectionAddressCity = drop.collectionAddressCity;
        newOrder.collectionAddressPostcode = drop.collectionAddressPostcode;
        newOrder.collectionAddressCountry = 'UK';
        break;
      default:
        throw new Error('Invalid delivery method');
    }

    console.log(`Creating order ${JSON.stringify(newOrder)}`);
    try {
      return this.orderRepo.create(newOrder);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async createMulti(
    currentUserUuid: string,
    drops: Drop[],
    order: CreateMultiOrderDto
  ): Promise<void> {
    Logger.log(`Creating order`, OrderService.name);
    const newOrder = new MultiOrder();

    newOrder.uuid = order.uuid;
    newOrder.order_total = this.calculateMultiOrderTotal(
      0,
      drops
    );
    newOrder.order_status = 'OPEN';

    switch (order.deliveryMethod) {
      case 'LOCAL_DELIVERY':
        newOrder.deliveryMethod = 'LOCAL_DELIVERY';
        newOrder.deliveryAddressLine1 = order.deliveryAddressLine1;
        newOrder.deliveryAddressLine2 = order.deliveryAddressLine2;
        newOrder.deliveryAddressCity = order.deliveryAddressCity;
        newOrder.deliveryAddressPostcode = order.deliveryAddressPostcode;
        newOrder.deliveryAddressCountry = order.deliveryAddressCountry;
        break;
      default:
        throw new Error('Invalid delivery method');
    }

    console.log(`Creating order ${JSON.stringify(newOrder)}`);
    try {
      await this.multiOrderRepo.create(newOrder);

      const newMultiOrder = await this.multiOrderRepo.get(newOrder.uuid);

      // Create order lines
      const orderLines = drops.map((drop) => {
        const orderLine = new MultiOrderLine();
        orderLine.unit_price = drop.price;
        orderLine.quantity = 1;
        orderLine.line_total = orderLine.unit_price * orderLine.quantity;
        orderLine.multiOrderId = newMultiOrder.id;
        orderLine.line_title = drop.name;
        return orderLine;
      });

      // Create Order Lines
      await this.multiOrderLineRepo.bulkCreate(orderLines);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getAllForUser(userUuid: string): Promise<any> {
    Logger.log(`Getting all orders for user ${userUuid}`, OrderService.name);
    const purchases = await this.orderRepo.findAll({
      where: {
        buyerUuid: userUuid,
      },
      order: [['createdAt', 'DESC']],
    });

    const sales = await this.orderRepo.findAll({
      where: {
        sellerUuid: userUuid,
      },
      order: [['createdAt', 'DESC']],
    });

    return {
      forUser: userUuid,
      purchases: purchases,
      sales: sales,
    };
  }

  async get(uuid: string): Promise<Order> {
    return await this.orderRepo.get(uuid);
  }

  async getMulti(uuid: string): Promise<MultiOrder> {
    return await this.multiOrderRepo.get(uuid);
  }

  async updateOrderStatus(uuid: string, status: OrderStatus): Promise<void> {
    const order = await this.orderRepo.get(uuid);
    order.order_status = status;
    await this.orderRepo.update(order);
  }
}
