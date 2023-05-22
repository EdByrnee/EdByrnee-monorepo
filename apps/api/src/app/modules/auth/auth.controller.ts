import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileService } from '../files/file.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { IUploadResult } from '../files/interfaces/upload-result.interface';
import { User } from './utils/user.decorator';
import { RequestUser } from './utils/jwt.strategy';
import { Public } from './utils/no-auth.attribute';
import { RequestMagicLinkDto } from './dto/request-magic-link-dto';
import { SequelizeUow } from '../../core/database/infra/sequelize-uow';
import { UpdateProfilePhotosDto } from './dto/update-profile-photos.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private fileService: FileService,
    private uow: SequelizeUow
  ) {}

  // @Patch('users/profile')
  // @ApiOperation({ summary: 'Update profile' })
  // @ApiResponse({ status: 200, description: 'Profile updated' })
  // async updateMyProfile(@User() requestUser: RequestUser, @Body() body: any) {
  //   return await this.uow.execute(async () => {
  //     return await this.authService.updateProfile(requestUser.uuid, body);
  //   });
  // }

  @Get('users/drivers')
  @ApiOperation({ summary: 'Get all drivers' })
  @ApiResponse({ status: 200, description: 'Drivers found' })
  async getAllDrivers() {
    return await this.authService.getAllDrivers();
  }

  @Public()
  @Post('request-otp')
  @ApiResponse({ status: 200, description: 'Get OTP for Login' })
  async requestOTP(@Body() body: { mobile_number: string }) {
    const mobile_number = body.mobile_number;
    return this.authService.requestOTP(mobile_number);
  }

  @Public()
  @Post('verify-otp')
  @ApiResponse({ status: 200, description: 'Verify OTP for Login' })
  loginViaOtp(@Body() body: { otp_token: string; otp_code: string }) {
    const otp_token = body.otp_token;
    const otp_code = body.otp_code;
    return this.authService.loginViaOtp(otp_code, otp_token);
  }

  @Patch('users/profile')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @UseInterceptors(FilesInterceptor('photos'))
  async uploadUserPhotos(
    @Body() body: UpdateProfilePhotosDto,
    @UploadedFiles() photos: Array<Express.Multer.File>,
    @User() user: RequestUser
  ): Promise<any> {
    Logger.log(`uploadUserPhotos`);
    return await this.uow.execute(async () => {
      if (photos.length > 0 || body.imageUuidsToRemove.length > 0) {
        photos.forEach((photo) => {
          const randomKey = Math.random().toString(36).substring(2, 15);
          photo.fieldname = user.uuid + '-storyPhoto-' + randomKey + '.jpg';
        });

        const uploadResults: IUploadResult[] =
          await this.fileService.upsertFileArray(
            photos,
            'local-shelf-demo-bucket'
          );

        await this.authService.patchUserPhotos(
          user.uuid,
          body.imageUuidsToRemove,
          uploadResults
        );
      }

      await this.authService.updateProfile(user.uuid, body.userProfileUpdates);
    });
  }

  @Get('users/:userUuid/profile')
  @ApiOperation({ summary: 'Get profile' })
  @ApiResponse({ status: 200, description: 'Profile' })
  async getUserProfile(@Param('userUuid') userUuid: string) {
    return await this.uow.execute(async () => {
      return await this.authService.getProfile(userUuid);
    });
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() body: any) {
    return await this.uow.execute(async () => {
      return await this.authService.login(body.email, body.password);
    });
  }

  @Public()
  @Post('password-reset-email')
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  async sendPasswordResetEmail(@Body() body: any) {
    return await this.uow.execute(async () => {
      return await this.authService.sendPasswordResetEmail(body.email);
    });
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Password reset' })
  async resetPassword(@Body() body: any) {
    return await this.uow.execute(async () => {
      return await this.authService.resetPassword(body.password, body.token);
    });
  }

  @Public()
  @Post('magic-link')
  @ApiOperation({ summary: 'Request magic link' })
  @ApiResponse({ status: 200, description: 'Request Magic link' })
  async requestMagicLink(@Body() body: RequestMagicLinkDto) {
    return await this.uow.execute(async () => {
      return await this.authService.requestMagicLink(body.email);
    });
  }

  // Public so user can see the feed without being logged in
  @Public()
  @Get('makers/suggested')
  @ApiOperation({ summary: 'List suggested makers' })
  @ApiResponse({ status: 200, description: 'List of suggested makers' })
  async listSuggestedMakers() {
    return await this.uow.execute(async () => {
      return await this.authService.listSuggestedMakers();
    });
  }

  @Get('users/profile')
  @ApiOperation({ summary: 'Get profile' })
  @ApiResponse({ status: 200, description: 'Profile' })
  async getMyProfile(@User() requestUser: RequestUser) {
    return await this.uow.execute(async () => {
      return await this.authService.getProfile(requestUser.uuid);
    });
  }

  // Upload profile photo
  @Post('profile-photo')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiOperation({ summary: 'Upload profile photo' })
  @ApiResponse({ status: 200, description: 'Profile photo uploaded' })
  async uploadProfilePhoto(
    @User() user: RequestUser,
    @UploadedFile() photo: Express.Multer.File
  ) {
    return await this.uow.execute(async () => {
      photo.fieldname = `${
        user.uuid
      } - profile photo.jpg ${new Date().toISOString()}`;

      const newlyUploadedPhotos: IUploadResult[] =
        await this.fileService.upsertFileArray(
          [photo],
          'local-shelf-demo-bucket'
        );

      return await this.authService.uploadProfilePhoto(
        user.uuid,
        newlyUploadedPhotos[0].fileUrl
      );
    });
  }
}
