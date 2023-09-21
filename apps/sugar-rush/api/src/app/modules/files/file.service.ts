import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as uuid from 'uuid';
import { IRepositoryPort } from '../../core/database/ports/repository-port';
import { FileEntity } from './file.entity';
import { FILE_REPOSITORY, FILE_STORAGE } from './files.providers';
import { IFileStoragePort } from './interfaces/file-storage-port.interface';
import { IUploadResult } from './interfaces/upload-result.interface';

@Injectable()
export class FileService {
  constructor(
    private configService: ConfigService,
    @Inject(FILE_REPOSITORY)
    private fileRepository: IRepositoryPort<FileEntity>,
    @Inject(FILE_STORAGE) private fileStorage: IFileStoragePort
  ) {}

  public async upsertFileArray(
    files: Array<Express.Multer.File>,
    bucketName: string
  ): Promise<Array<IUploadResult>> {
    const uploadResults: Array<IUploadResult> = [];

    for (const file of files) {
      const uploadResult: IUploadResult = await this.upsertToBucket(
        file.buffer,
        file.fieldname,
        bucketName
      );
      uploadResults.push(uploadResult);
    }

    return uploadResults;
  }

  private async upsertToBucket(
    dataBuffer: Buffer,
    fileKey: string,
    bucketName: string
  ): Promise<IUploadResult> {
    if(dataBuffer.byteLength < 1024 * 10) Logger.warn(`Image size is smaller than 50kb (${dataBuffer.byteLength}b), faulty upload?`);
    
    const fileExistsInBucket: FileEntity = await this.fileRepository.findOne({
      fileKey: fileKey,
      bucketName: bucketName,
    });

    const uploadResult: IUploadResult = await this.fileStorage.putFile(
      bucketName,
      dataBuffer,
      fileKey
    );

    if (fileExistsInBucket) {
      Logger.log('File exists, overwriting...');
      fileExistsInBucket.updatedAt = new Date();
      await this.fileRepository.update(fileExistsInBucket);
    } else {
      Logger.log('File does not exist, creating new...');
      const newFile = new FileEntity({
        uuid: uuid.v4(),
        fileKey: fileKey,
        bucketName: bucketName,
        publicUrl: uploadResult.fileUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await this.fileRepository.create(newFile);
      Logger.log('File created (remotely + locally)');
    }

    return uploadResult;
  }
}
