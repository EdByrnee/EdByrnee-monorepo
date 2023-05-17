import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRepositoryPort } from '../../core/database/ports/repository-port';
import { PasswordResetToken } from './entities/user-password-reset-token';
import { UserProfile } from './entities/user-profile.entity';
import { OBJECT_NOT_FOUND_ERROR } from './errors/object-not-found.error';
import { JwtService } from '@nestjs/jwt';
import {
  DeliveryMethod,
  IDrop,
  IUserProfile,
} from '@shoppr-monorepo/api-interfaces';
import { EMAIL_GATEWAY } from '../../core/database/infra/gateways/email/smtp/email-gateway.injection-tokens';
import { IEmailGatewayPort } from '../../core/database/ports/email-gateway.port';
import { MultiOrder } from '../orders/entity/multi-order.entity';
import { CreateMultiOrderDto } from '../orders/dto/create-multi-order.dto';

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

  public async sendOrderConfirmationEmail(
    buyerUuid: string,
    drops: IDrop[],
    createOrder: CreateMultiOrderDto,
    multiOrder: MultiOrder
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
      dropName: drops[0].name,
      dropDescription: drops[0].description,
      customerName: userProfile.name,
      deliveryType: 'Local Delivery',
      deliveryAddress: 'drop.delivery_address',
      orderTotal: '£' + multiOrder.order_total,
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
