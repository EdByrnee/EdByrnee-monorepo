import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UnprocessableEntityException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Drop } from './entities/drop.entity';
import { DropService } from './drops.service';
import { DropStatus, IDrop, IDropFeed } from '@shoppr-monorepo/api-interfaces';
import { CreateDropDto } from './dto/new-drop.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import 'multer';
import { FileService } from '../files/file.service';
import { IUploadResult } from '../files/interfaces/upload-result.interface';
import { User } from '../auth/utils/user.decorator';
import { RequestUser } from '../auth/utils/jwt.strategy';
import { Public } from '../auth/utils/no-auth.attribute';
import { UpdateDropDto } from './dto/update-drop.dto';
import { SequelizeUow } from '../../core/database/infra/sequelize-uow';
import { AuthService } from '../auth/auth.service';
import { CreateDropItemDto } from './dto/new-drop-items';
import { DropItem } from './entities/drop-item';

@ApiTags('Authentication')
@Controller('/drops')
export class DropsController {
  private readonly logger = new Logger(DropsController.name);

  constructor(
    private dropService: DropService,
    private filesService: FileService,
    private uow: SequelizeUow,
    private authService: AuthService
  ) {}

  @Get('/items/current-user')
  async getDropItemsForCurrentUser(@User() user: RequestUser): Promise<DropItem[]> {
    return await this.uow.execute(async () => {
      return await this.dropService.getDropItemsForCurrentUser(user.uuid);
    });
  }

  @Patch('/:dropUuid/replenish-warehouse/')
  async replenishDropQuantityToWarehouse(
    @Param('dropUuid') dropUuid: string,
    @Body() replenishDropQuantityToWarehouseDto: CreateDropItemDto[]
  ) {
    return await this.uow.execute(async () => {
      return await this.dropService.replenishDropQuantityToWarehouse(
        dropUuid,
        replenishDropQuantityToWarehouseDto
      );
    });
  }

  @Patch('/items/:dropItemUuid/location')
  async updateDropItemLocation(
    @Param('dropItemUuid') dropItemUuid: string,
    @Body() body: { locationOrDriverUuid: string; withDriver: boolean }
  ) {
    return await this.uow.execute(async () => {
      return await this.dropService.transferDropLocation(
        dropItemUuid,
        body.locationOrDriverUuid,
        body.withDriver
      );
    });
  }

  @Get('/maker/:makerId')
  async getDropsByMaker(
    @Param('makerId') makerId: string,
    @User() user: RequestUser
  ): Promise<Drop[]> {
    return await this.uow.execute(async () => {
      return await this.dropService.getDropsByMaker(user.uuid, makerId);
    });
  }

  // Public so user can see the feed without being logged in
  @Public()
  @Get('/feed/v2')
  async getDropFeedV2(): Promise<IDropFeed[]> {
    return await this.uow.execute(async () => {
      const localMakersFeed = {
        title: 'Deals',
        appendWithPostcode: false,
        listingType: 'Maker',
        data: await this.authService.listSuggestedMakers(),
      };

      const dealsFeed = {
        title: 'Deals',
        appendWithPostcode: true,
        listingType: 'Drop_Vertical',
        data: (await this.dropService.getSuggestedDrops()) as any[],
      };

      const popularDropsFeed = {
        title: 'Shakes',
        appendWithPostcode: true,
        listingType: 'Drop_Horizontal',
        data: (await this.dropService.getPopularDrops()) as any[],
      };

      const cookiesFeed = {
        title: 'Cookies',
        appendWithPostcode: false,
        listingType: 'Drop_Horizontal',
        data: (await this.dropService.getPopularDrops()) as any[],
      };

      const browniesFeed = {
        title: 'Brownies',
        appendWithPostcode: false,
        listingType: 'Drop_Horizontal',
        data: (await this.dropService.getPopularDrops()) as any[],
      };

      const cakesFeed = {
        title: 'Cakes',
        appendWithPostcode: false,
        listingType: 'Drop_Horizontal',
        data: (await this.dropService.getPopularDrops()) as any[],
      };

      const drinksFeed = {
        title: 'Drinks',
        appendWithPostcode: false,
        listingType: 'Drop_Horizontal',
        data: (await this.dropService.getPopularDrops()) as any[],
      };

      const iceCreamFeed = {
        title: 'Ice Cream',
        appendWithPostcode: false,
        listingType: 'Drop_Horizontal',
        data: (await this.dropService.getPopularDrops()) as any[],
      };

      return [
        dealsFeed,
        cookiesFeed,
        browniesFeed,
        cakesFeed,
        drinksFeed,
        iceCreamFeed,
      ];
    });
  }

  // Public so user can see the feed without being logged in
  @ApiOperation({ deprecated: true })
  @Public()
  @Get('/feed')
  async getDropFeed(): Promise<IDropFeed[]> {
    return await this.uow.execute(async () => {
      return await this.dropService.getDropFeed();
    });
  }

  @Get('/:uuid')
  async getDrop(@Param('uuid') uuid: string): Promise<Drop> {
    return await this.uow.execute(async () => {
      return await this.dropService.getDrop(uuid);
    });
  }

  @Patch('/:uuid/status')
  async updateStatus(
    @Param('uuid') uuid: string,
    @Body() body: { status: DropStatus },
    @User() user: RequestUser
  ) {
    return await this.uow.execute(async () => {
      Logger.log(`Updating status of drop ${uuid} to ${body.status}`);
      return await this.dropService.updateStatus(user.uuid, uuid, body.status);
    });
  }

  @Patch('/:uuid')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos'))
  async updateDrop(
    @Param('uuid') uuid: string,
    @Body() body: UpdateDropDto,
    @UploadedFiles() newPhotos: Array<Express.Multer.File>,
    @User() user: RequestUser
  ) {
    return await this.uow.execute(async () => {
      Logger.log(`Updating drop ${uuid}`);
      if (body.updates.localDeliveryEnabled) {
        // Validate local delivery fields
        if (!body.updates.localDeliveryCost)
          throw new UnprocessableEntityException(
            'Local delivery price required if local delivery is enabled'
          );
        if (!body.updates.localDeliveryGuidelines)
          throw new UnprocessableEntityException(
            'Local delivery guidelines required if local delivery is enabled'
          );
      }

      if (body.updates.nationalDeliveryEnabled) {
        // Validate national delivery fields
        if (!body.updates.nationalDeliveryCost)
          throw new UnprocessableEntityException(
            'National delivery price required if national delivery is enabled'
          );
        if (!body.updates.nationalDeliveryGuidelines)
          throw new UnprocessableEntityException(
            'National delivery guidelines required if national delivery is enabled'
          );
      }

      if (body.updates.collectionEnabled) {
        // Validate collection fields
        if (!body.updates.collectionGuidelines)
          throw new UnprocessableEntityException(
            'Collection guidelines required if collection is enabled'
          );
        if (!body.updates.collectionAddressLine1)
          throw new UnprocessableEntityException(
            'Collection address line 1 required if collection is enabled'
          );
        if (!body.updates.collectionAddressCity)
          throw new UnprocessableEntityException(
            'Collection address city required if collection is enabled'
          );
        if (!body.updates.collectionAddressPostcode)
          throw new UnprocessableEntityException(
            'Collection address postcode required if collection is enabled'
          );
      }

      let uploadResults: IUploadResult[] = [];
      if (newPhotos.length > 0) {
        Logger.log(`New photos were included in the request`);
        newPhotos.forEach((photo) => {
          const randomKey = Math.random().toString(36).substring(2, 15);
          photo.fieldname = uuid + '-' + photo.fieldname + randomKey + '.jpg';
        });

        uploadResults = await this.filesService.upsertFileArray(
          newPhotos,
          'local-shelf-demo-bucket'
        );
      }

      return await this.dropService.updateDrop(
        user.uuid,
        uuid,
        body.updates,
        uploadResults
      );
    });
  }

  @Get('/')
  async getDrops(): Promise<Drop[]> {
    return await this.uow.execute(async () => {
      return await this.dropService.getDrops();
    });
  }

  @Get('search/:searchTerm')
  async searchDrops(@Param('searchTerm') searchTerm: string): Promise<Drop[]> {
    return await this.uow.execute(async () => {
      return await this.dropService.searchDrops(searchTerm);
    });
  }

  @Post('/')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('photos'))
  async createDrop(
    @Body() body: CreateDropDto,
    @UploadedFiles() photos: Array<Express.Multer.File>,
    @User() user: RequestUser
  ): Promise<any> {
    return await this.uow.execute(async () => {
      Logger.log('Request recieved to create a new drop', 'DropsController');

      if (body.drop.localDeliveryEnabled) {
        // Validate local delivery fields
        if (!body.drop.localDeliveryCost)
          throw new UnprocessableEntityException(
            'Local delivery price required if local delivery is enabled'
          );
        if (!body.drop.localDeliveryGuidelines)
          throw new UnprocessableEntityException(
            'Local delivery guidelines required if local delivery is enabled'
          );
      }

      if (body.drop.nationalDeliveryEnabled) {
        // Validate national delivery fields
        if (!body.drop.nationalDeliveryCost)
          throw new UnprocessableEntityException(
            'National delivery price required if national delivery is enabled'
          );
        if (!body.drop.nationalDeliveryGuidelines)
          throw new UnprocessableEntityException(
            'National delivery guidelines required if national delivery is enabled'
          );
      }

      if (body.drop.collectionEnabled) {
        // Validate collection fields
        if (!body.drop.collectionGuidelines)
          throw new UnprocessableEntityException(
            'Collection guidelines required if collection is enabled'
          );
        if (!body.drop.collectionAddressLine1)
          throw new UnprocessableEntityException(
            'Collection address line 1 required if collection is enabled'
          );
        if (!body.drop.collectionAddressCity)
          throw new UnprocessableEntityException(
            'Collection address city required if collection is enabled'
          );
        if (!body.drop.collectionAddressPostcode)
          throw new UnprocessableEntityException(
            'Collection address postcode required if collection is enabled'
          );
      }

      photos.forEach((photo) => {
        const randomKey = Math.random().toString(36).substring(2, 15);
        photo.fieldname =
          body.drop.uuid + '-' + photo.fieldname + randomKey + '.jpg';
      });

      const uploadResults: IUploadResult[] =
        await this.filesService.upsertFileArray(
          photos,
          'local-shelf-demo-bucket'
        );

      await this.dropService.createDrop(
        body.drop as any,
        user.uuid,
        uploadResults
      );

      return this.dropService.getDrop(body.drop.uuid);
    });
  }
}
