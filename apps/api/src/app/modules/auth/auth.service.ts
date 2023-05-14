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
import { IUserProfile } from '@shoppr-monorepo/api-interfaces';
import { EMAIL_GATEWAY } from '../../core/database/infra/gateways/email/smtp/email-gateway.injection-tokens';
import { IEmailGatewayPort } from '../../core/database/ports/email-gateway.port';
import * as uuid from 'uuid';
import { IUploadResult } from '../files/interfaces/upload-result.interface';
import { USER_PHOTOS_REPO } from './auth.providers';
import { UserPhoto } from './entities/user-photos.entity';
import { Op } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPO') private userRepo: IRepositoryPort<UserProfile>,
    @Inject(USER_PHOTOS_REPO)
    private userProfilePhotoRepo: IRepositoryPort<UserPhoto>,
    @Inject('PASSWORD_RESET_TOKEN_REPO')
    private passwordResetTokenRepo: IRepositoryPort<PasswordResetToken>,
    private encryptionService: EncryptionService,
    private jwtService: JwtService,
    @Inject(EMAIL_GATEWAY)
    private emailGateway: IEmailGatewayPort
  ) {}

  async patchUserPhotos(
    userUuid: string,
    imageUuidsToRemove: string[],
    uploadResults: IUploadResult[]
  ): Promise<void> {
    const user = await this.userRepo.get(userUuid);
    if (!user) {
      throw new NotFoundException(OBJECT_NOT_FOUND_ERROR);
    }

    if (imageUuidsToRemove.length > 0) {
      await this.userProfilePhotoRepo.removeMany({
        uuid: {
          [Op.in]: imageUuidsToRemove,
        },
      });
    }

    for (const uploadResult of uploadResults) {
      const photo = new UserPhoto({
        userProfileId: user.id,
        uuid: uuid.v4(),
        photo_url: uploadResult.fileUrl,
      });
      await this.userProfilePhotoRepo.create(photo);
    }
  }

  async validateUser(username: string, password: string) {
    const user = await this.userRepo.findOne({
      username,
    });
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  public async login(email: string, password: string): Promise<any> {
    Logger.log(`Attemping login for user with email: ${email}`);
    const userProfile: UserProfile = await this.userRepo.findOne({
      email: email,
    });

    if (userProfile == null) {
      Logger.log(`No user found for email: ${email}`);
      throw new UnauthorizedException();
    } else {
      Logger.log(`User found for email: ${email}`);
    }

    if (userProfile.emailVerified === false) {
      Logger.log('Users email has not been verified');
      throw new UnprocessableEntityException();
    }

    // const passwordValid = await this.encryptionService.compare(
    //   password,
    //   userProfile.password
    // );

    const passwordValid = true;

    if (!passwordValid) {
      Logger.log('User password invalid');
      throw new UnauthorizedException();
    }

    // userProfile.lastSignIn = new Date();
    // await this.userRepo.update(userProfile);

    const access_token = this.jwtService.sign({ sub: userProfile.uuid });

    Logger.log(
      `Successfully returning login token for user ${userProfile.uuid}`
    );
    return { access_token: access_token };
  }

  public async requestMagicLink(email: string) {
    let userProfile: UserProfile = await this.userRepo.findOne({
      email: email.toLowerCase(),
    });

    if (!userProfile) {
      userProfile = new UserProfile();
      userProfile.email = email;
      userProfile.uuid = uuid.v4();
      await userProfile.save();
    }

    const token = this.jwtService.sign({ sub: userProfile.uuid });
    Logger.log(`Creating magic link for userUuid ${userProfile.uuid}`);
    Logger.log(`Token is ${token}`);

    try {
      await this.emailGateway.sendEmailTemplate(
        userProfile.email,
        'Local Shelf Login',
        'magic-link',
        {
          magicLink: process.env.EMAIL_LOGIN_LINK + '#' + token,
        }
      );
    } catch (err) {
      Logger.warn(`Error sending email: ${err}`);
      throw err;
    }
  }

  public async loginViaOtp(otp: string, otp_token: string) {

    Logger.log(`Attemping login via otp`);
    Logger.log(`otp is ${otp}, otp_token is ${otp_token}`);

    let mobile_number: string;

    try {
      const decoded = this.jwtService.verify(otp_token, {
        secret: otp,
      });
      mobile_number = decoded.mobile_number;
    } catch (err) {
      Logger.warn(`Error decoding otpToken: ${err}`);
      throw err;
    }

    const userProfile: UserProfile = await this.userRepo.findOne({
      mobile_number: mobile_number,
    });

    if (!userProfile) {
      throw new NotFoundException(OBJECT_NOT_FOUND_ERROR);
    }

    const access_token = this.jwtService.sign({ sub: userProfile.uuid });

    Logger.log(
      `Successfully returning login token for user ${userProfile.uuid}`
    );
    return { access_token: access_token };
  }

  public async requestOTP(mobile_number: string) {
    const otp = Math.floor(1000 + Math.random() * 9000);

    let userProfile: UserProfile | any = await this.userRepo.findOne({
      mobile_number: mobile_number,
    });

    if (!userProfile) {
      userProfile = new UserProfile();
      userProfile.mobile_number = mobile_number;
      userProfile.uuid = uuid.v4();
      await userProfile.save();
    }

    const otpToken = this.jwtService.sign(
      { mobile_number: mobile_number },
      {
        expiresIn: '10m',
        secret: otp.toString(),
      }
    );

    /* Send OTP to user here */

    Logger.log(
      `Created OTP token for user with mobile number: ${mobile_number} with otp ${otp}`
    );
    return {
      otp_token: otpToken,
    };
  }

  public async resetPassword(
    newPassword: string,
    token: string
  ): Promise<void> {
    const userProfile: UserProfile = await this.userRepo.findOne({
      email: 'ed_b@hotmail.co.uk',
    });

    Logger.log(`Resetting password for userUuid ${userProfile.uuid}`);

    const newPasswordHash = await this.encryptionService.hash(newPassword);

    userProfile.password = newPasswordHash;

    await this.userRepo.update(userProfile);
  }

  async listSuggestedMakers(): Promise<IUserProfile[]> {
    return await this.userRepo.findAll({
      where: { maker: true },
    });
  }

  async getProfile(uuid: string) {
    const user: UserProfile = await this.userRepo.get(uuid);
    if (!user) {
      Logger.log(`No user found for uuid: ${uuid}`);
      throw new NotFoundException(`No user found for uuid: ${uuid}`);
    }

    return user;
  }

  async updateProfile(uuid: string, updates: Partial<UserProfile>) {
    const user: UserProfile = await this.userRepo.findOne({ uuid: uuid });
    if (!user) throw new NotFoundException(OBJECT_NOT_FOUND_ERROR);
    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;
    if (updates.website) user.website = updates.website;
    if (updates.bio) user.bio = updates.bio;
    if (updates.story) user.story = updates.story;
    if (updates.lastSetPostcode) user.lastSetPostcode = updates.lastSetPostcode;

    if (updates.username && !user.username) {
      const usernameTaken = await this.userRepo.findOne({
        username: updates.username?.toLowerCase(),
      });
      if (usernameTaken)
        throw new UnprocessableEntityException({
          message: `Username ${updates.username} is already taken`,
          error: 'USERNAME_TAKEN',
        });
      Logger.log(
        `Setting username for user ${user.uuid} to ${updates.username}`
      );
      user.username = updates.username;
    }

    await this.userRepo.update(user);
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.userRepo.findOne({ email });
    if (!user) throw new NotFoundException(OBJECT_NOT_FOUND_ERROR);
    const token = new PasswordResetToken();
    token.userId = user.id;
    token.expiresOn = new Date(Date.now() + 1000 * 60 * 60 * 24);
    token.token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    this.passwordResetTokenRepo.create(token);
  }

  async uploadProfilePhoto(uuid: string, photoUrl: string) {
    const user: UserProfile = await this.userRepo.findOne({ uuid: uuid });
    if (!user) throw new NotFoundException(OBJECT_NOT_FOUND_ERROR);
    user.photoUrl = photoUrl;
    await this.userRepo.update(user);
  }

  getUserProfiles(userUuids: string[]): Promise<UserProfile[]> {
    return this.userRepo.findAll({
      where: {
        uuid: userUuids,
      },
    });
  }
}
