import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IRepositoryPort } from '../../core/database/ports/repository-port';
import { PasswordResetToken } from './entities/user-password-reset-token';
import { UserProfile } from './entities/user-profile.entity';
import { OBJECT_NOT_FOUND_ERROR } from './errors/object-not-found.error';
import { EncryptionService } from './encryption.service';
import { JwtService } from '@nestjs/jwt';
import {
  DeliveryMethod,
  IDrop,
  IOrder,
  IUserProfile,
} from '@shoppr-monorepo/api-interfaces';
import { EMAIL_GATEWAY } from '../../core/database/infra/gateways/email/smtp/email-gateway.injection-tokens';
import { IEmailGatewayPort } from '../../core/database/ports/email-gateway.port';
import * as uuid from 'uuid';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { create } from 'domain';
import { Order } from '../orders/order.entity';

@Injectable()
export class EmailService {
  constructor(
    @Inject('USER_REPO') private userRepo: IRepositoryPort<UserProfile>,
    @Inject('PASSWORD_RESET_TOKEN_REPO')
    private passwordResetTokenRepo: IRepositoryPort<PasswordResetToken>,
    private jwtService: JwtService,
    @Inject(EMAIL_GATEWAY)
    private emailGateway: IEmailGatewayPort
  ) {}

  private deliveryTypeToText(deliveryType: DeliveryMethod): string {
    switch (deliveryType) {
      case 'COLLECTION':
        return 'Collection';
      case 'LOCAL_DELIVERY':
        return 'Local Delivery';
      case 'NATIONAL_DELIVERY':
        return 'National Delivery';
    }
  }

  public async sendBuyerOrderConfirmationEmail(
    buyerUuid: string,
    drop: IDrop,
    createOrder: CreateOrderDto,
    order: Order
  ): Promise<void> {
    const userProfile: IUserProfile = await this.userRepo.get(buyerUuid);
    if (userProfile == null) {
      throw new NotFoundException(OBJECT_NOT_FOUND_ERROR);
    }

    const email = userProfile.email;
    const subject = `Order Confirmation`;
    const templateName = 'buyer-order-confirmation.hbs';
    const templateData = {
      myOrdersUrl: 'https://shoppr.com/orders',
      dropName: drop.name,
      dropDescription: drop.description,
      customerName: userProfile.name,
      deliveryType: this.deliveryTypeToText(createOrder.deliveryMethod),
      deliveryAddress: 'drop.delivery_address',
      orderTotal: '£' + order.order_total,
      orderDate: new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    this.emailGateway.sendEmailTemplate(
      email,
      subject,
      templateName,
      templateData
    );
  }

  public async sendMakerOrderConfirmationEmail(
    buyerUuid: string,
    drop: IDrop,
    createOrder: CreateOrderDto,
    order: Order
  ): Promise<void> {
    const userProfile: IUserProfile = await this.userRepo.get(buyerUuid);
    if (userProfile == null) {
      throw new NotFoundException(OBJECT_NOT_FOUND_ERROR);
    }

    const email = userProfile.email;
    const subject = `You've got a new order!`;
    const templateName = 'maker-order-confirmation.hbs';
    const templateData = {
      myOrdersUrl: 'https://shoppr.com/orders',
      dropName: drop.name,
      dropDescription: drop.description,
      customerName: userProfile.name,
      customerEmail: userProfile.email,
      deliveryType: this.deliveryTypeToText(createOrder.deliveryMethod),
      deliveryAddressLine1: createOrder.deliveryAddressLine1,
      deliveryAddressLine2: createOrder.deliveryAddressLine2,
      deliveryAddressPostcode: createOrder.deliveryAddressPostcode,
      deliveryAddressCity: createOrder.deliveryAddressCity,
      orderTotal: '£' + order.order_total,
      orderDate: new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    this.emailGateway.sendEmailTemplate(
      email,
      subject,
      templateName,
      templateData
    );
  }
}
