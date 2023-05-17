import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DropStatus, IDrop, IDropFeed } from '@shoppr-monorepo/api-interfaces';
import { IRepositoryPort } from '../../core/database/ports/repository-port';
import { DROP_REPOSITORY, DROP_PHOTO_REPOSITORY } from './drops.providers';
import { DropPhoto } from './entities/drop-photo.entity';
import { Drop } from './entities/drop.entity';
import * as uuid from 'uuid';
import { IUploadResult } from '../files/interfaces/upload-result.interface';
import { Op } from 'sequelize';
import { DropUpdatesDto, UpdateDropDto } from './dto/update-drop.dto';

@Injectable()
export class DropService {

  constructor(
    @Inject(DROP_REPOSITORY)
    private readonly dropRepository: IRepositoryPort<Drop>,
    @Inject(DROP_PHOTO_REPOSITORY)
    private readonly dropPhotoRepository: IRepositoryPort<DropPhoto>
  ) {}

  
  async getDrops(filter?: any): Promise<Drop[]> {
    return this.dropRepository.findAll({
      where: (filter || {})
    });
  }

  async getDropsByMaker(userUuid: string, makerId: string): Promise<Drop[]> {
    const filter = {
      where: {
        makerUuid: makerId,
      },
      order: [['createdAt', 'DESC']],
    };
    if (userUuid !== makerId) {
      filter['where']['status'] = 'ACTIVE_LISTING';
    }
    const drops = await this.dropRepository.findAll(filter);
    return drops;
  }

  async updateStatus(
    userUuid: string,
    dropUuid: string,
    newStatus: DropStatus
  ): Promise<void> {
    const drop: Drop = await this.dropRepository.findOne({
      makerUuid: userUuid,
      uuid: dropUuid,
    });

    if (!drop) {
      throw new NotFoundException('Drop not found');
    }

    if (drop.status === 'AWAITING_APPROVAL') {
      throw new HttpException(
        'You cannot change the status of a drop awaiting approval',
        HttpStatus.FORBIDDEN
      );
    }

    drop.status = newStatus;
    await this.dropRepository.update(drop);
  }

  async updateDrop(
    userUuid: string,
    dropUuid: string,
    updates: DropUpdatesDto,
    uploadResults: IUploadResult[]
  ) {
    Logger.log(`Searching for drop ${dropUuid}`);
    Logger.log(`By maker ${userUuid}`);

    const drop: Drop = await this.dropRepository.findOne({
      makerUuid: userUuid,
      uuid: dropUuid,
    });

    if (!drop) {
      throw new NotFoundException('Drop not found');
    }

    if (updates.name !== undefined) {
      drop.name = updates.name;
    }
    if (updates.description !== undefined) {
      drop.description = updates.description;
    }
    if (updates.price !== undefined) {
      drop.price = updates.price;
    }
    if (updates.qty_available !== undefined) {
      drop.qty_available = updates.qty_available;
    }
    if (updates.size !== undefined) {
      drop.size = updates.size;
    }
    if (updates.ingredients !== undefined) {
      drop.ingredients = updates.ingredients;
    }
    if (updates.age_restricted !== undefined) {
      drop.age_restricted = updates.age_restricted;
    }
    if (updates.allergens !== undefined) {
      drop.allergens = updates.allergens;
    }
    if (updates.status !== undefined) {
      drop.status = updates.status;
    }
    if (updates.localDeliveryEnabled !== undefined) {
      drop.localDeliveryEnabled = updates.localDeliveryEnabled;
    }
    if (updates.localDeliveryCost !== undefined) {
      drop.localDeliveryCost = updates.localDeliveryCost;
    }
    if (updates.localDeliveryGuidelines !== undefined) {
      drop.localDeliveryGuidelines = updates.localDeliveryGuidelines;
    }
    if (updates.localDeliveryRadius !== undefined) {
      drop.localDeliveryRadius = updates.localDeliveryRadius;
    }
    if (updates.localDeliveryLat !== undefined) {
      drop.localDeliveryLat = updates.localDeliveryLat;
    }
    if (updates.localDeliveryLng !== undefined) {
      drop.localDeliveryLng = updates.localDeliveryLng;
    }
    if (updates.nationalDeliveryEnabled !== undefined) {
      drop.nationalDeliveryEnabled = updates.nationalDeliveryEnabled;
    }
    if (updates.nationalDeliveryCost !== undefined) {
      drop.nationalDeliveryCost = updates.nationalDeliveryCost;
    }
    if (updates.nationalDeliveryGuidelines !== undefined) {
      drop.nationalDeliveryGuidelines = updates.nationalDeliveryGuidelines;
    }
    if (updates.collectionEnabled !== undefined) {
      drop.collectionEnabled = updates.collectionEnabled;
    }
    if (updates.collectionGuidelines !== undefined) {
      drop.collectionGuidelines = updates.collectionGuidelines;
    }
    if (updates.collectionAddressLine1 !== undefined) {
      drop.collectionAddressLine1 = updates.collectionAddressLine1;
    }
    if (updates.collectionAddressLine2 !== undefined) {
      drop.collectionAddressLine2 = updates.collectionAddressLine2;
    }
    if (updates.collectionAddressPostcode !== undefined) {
      drop.collectionAddressPostcode = updates.collectionAddressPostcode;
    }
    if (updates.collectionAddressCity !== undefined) {
      drop.collectionAddressCity = updates.collectionAddressCity;
    }

    if (updates.imageUuidsToRemove.length > 0) {
      await this.dropPhotoRepository.removeMany({
        uuid: {
          [Op.in]: updates.imageUuidsToRemove,
        },
      });
    }

    // const dropPhotos: DropPhoto[] = [];
    for (const uploadResult of uploadResults) {
      const dropPhoto = new DropPhoto();
      dropPhoto.uuid = uuid.v4();
      dropPhoto.dropId = drop.id;
      dropPhoto.photo_url = uploadResult.fileUrl;
      dropPhoto.createdAt = new Date();
      dropPhoto.updatedAt = new Date();
      // dropPhotos.push(dropPhoto);
      Logger.log(`Creating drop photo: ${dropPhoto.uuid}`, DropService.name);
      await this.dropPhotoRepository.create(dropPhoto);
    }

    await this.dropRepository.update(drop);
  }

  async getDrop(uuid: string): Promise<Drop> {
    // time out to simulate slow network
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    return this.dropRepository.get(uuid);
  }

  async decrementDropQuantity(dropUuid: string, quantity: number) {
    const drop: Drop = await this.dropRepository.get(dropUuid);
    drop.qty_available = drop.qty_available - quantity;
    await this.dropRepository.update(drop);
  }

  async createDrop(
    drop: Partial<Drop>,
    makerUuid: string,
    uploadResults: IUploadResult[]
  ): Promise<void> {
    const newDrop = new Drop();
    newDrop.uuid = drop.uuid;
    newDrop.name = drop.name;
    newDrop.description = drop.description;
    newDrop.price = drop.price;
    newDrop.qty_available = drop.qty_available;
    newDrop.size = drop.size;
    newDrop.ingredients = drop.ingredients;
    newDrop.age_restricted = drop.age_restricted;
    newDrop.allergens = drop.allergens;
    newDrop.createdAt = new Date();
    newDrop.updatedAt = new Date();
    newDrop.makerUuid = makerUuid;
    newDrop.itemCode = drop.itemCode;

    // Delivery info
    newDrop.localDeliveryEnabled = drop.localDeliveryEnabled;
    newDrop.localDeliveryCost = drop.localDeliveryCost;
    newDrop.localDeliveryGuidelines = drop.localDeliveryGuidelines;
    newDrop.localDeliveryRadius = drop.localDeliveryRadius;
    newDrop.localDeliveryLat = drop.localDeliveryLat;
    newDrop.localDeliveryLng = drop.localDeliveryLng;

    newDrop.nationalDeliveryEnabled = drop.nationalDeliveryEnabled;
    newDrop.nationalDeliveryCost = drop.nationalDeliveryCost;
    newDrop.nationalDeliveryGuidelines = drop.nationalDeliveryGuidelines;

    newDrop.collectionEnabled = drop.collectionEnabled;
    newDrop.collectionGuidelines = drop.collectionGuidelines;
    newDrop.collectionAddressLine1 = drop.collectionAddressLine1;
    newDrop.collectionAddressLine2 = drop.collectionAddressLine2;
    newDrop.collectionAddressPostcode = drop.collectionAddressPostcode;
    newDrop.collectionAddressCity = drop.collectionAddressCity;

    // Initial status
    newDrop.status = 'AWAITING_APPROVAL';

    await this.dropRepository.create(newDrop);

    const dropPhotos = [];
    for (const uploadResult of uploadResults) {
      const dropPhoto = new DropPhoto();
      dropPhoto.uuid = uuid.v4();
      dropPhoto.dropId = newDrop.id;
      dropPhoto.photo_url = uploadResult.fileUrl;
      dropPhoto.createdAt = new Date();
      dropPhoto.updatedAt = new Date();
      dropPhotos.push(dropPhoto);
      Logger.log(`Creating drop photo: ${dropPhoto.uuid}`, DropService.name);
      await this.dropPhotoRepository.create(dropPhoto);
    }

    // await this.dropPhotoRepository.create(demoPhoto);

    Logger.log(`Created drop: ${newDrop.uuid}`, DropService.name);
  }

  async getSuggestedDrops(): Promise<Drop[]> {
    const suggested = await this.dropRepository.findAll({
      where: {
        status: 'ACTIVE_LISTING',
      },
    });

    return suggested;
  }

  async getPopularDrops(): Promise<Drop[]> {
    const popular = await this.dropRepository.findAll({
      where: {
        status: 'ACTIVE_LISTING',
      },
    });

    return popular;
  }

  async getDropFeed(): Promise<any[]> {
    const popular = await this.dropRepository.findAll({
      where: {
        status: 'ACTIVE_LISTING',
      },
    });
    const suggested = await this.dropRepository.findAll({
      where: {
        status: 'ACTIVE_LISTING',
      },
    });
    return [
      {
        title: 'Selling fast in Liverpool',
        appendWithPostcode: true,
        drops: popular as any[],
        displayType: 'Horizontal',
      },
      {
        title: 'New near Liverpool',
        appendWithPostcode: true,
        drops: suggested as any,
      },
    ];
  }

  async searchDrops(searchTerm: string): Promise<Drop[]> {
    return this.dropRepository.findAll({
      where: {
        name: {
          [Op.like]: `%${searchTerm}%`,
        },
        status: 'ACTIVE_LISTING',
      },
    });
  }
}
