import { IUploadResult } from './upload-result.interface';

export interface IFileStoragePort {
  putFile(
    bucketName: string,
    body: Buffer,
    key: string
  ): Promise<IUploadResult>;
  deleteFromBucket(bucketName: string, fileName: string): Promise<boolean>;
  getFile(bucketName: string, fileName: string): Promise<any>;
  generatePresignedUrl(bucketName: string, fileName: string): Promise<string>;
}
