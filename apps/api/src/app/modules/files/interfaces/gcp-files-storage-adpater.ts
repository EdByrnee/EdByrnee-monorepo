import { Inject } from '@nestjs/common';
import { IFileStoragePort } from './file-storage-port.interface';
import { IUploadResult } from './upload-result.interface';
import { Storage } from '@google-cloud/storage';

export class GCPFileStorageAdapter implements IFileStoragePort {
  constructor(@Inject('GCP_STORAGE_INSTANCE') private storage: Storage) {}

  public putFile(
    bucketName: string,
    body: Buffer,
    fileKey: string
  ): Promise<IUploadResult> {
    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: body,
    };

    return this.storage
      .bucket(bucketName)
      .file(fileKey)
      .save(body)
      .then(() => {
        return {
          fileUrl: `https://storage.googleapis.com/${bucketName}/${fileKey}`,
        };
      });
  }

  public deleteFromBucket(
    bucketName: string,
    fileName: string
  ): Promise<boolean> {
    // Delete file from gcp
    return this.storage
      .bucket(bucketName)
      .file(fileName)
      .delete()
      .then(() => {
        return true;
      });
  }

  public async getFile(bucketName: string, fileKey: string): Promise<any> {
    // Get file from gcp
    return this.storage.bucket(bucketName).file(fileKey).download();
  }

  public generatePresignedUrl(
    bucketName: string,
    fileKey: string
  ): Promise<string> {
    // Generate presigned url from gcp
    return this.storage
      .bucket(bucketName)
      .file(fileKey)
      .getSignedUrl({
        action: 'read',
        expires: '03-09-2491',
      })
      .then((res: string[]) => {
        return res[0];
      });
  }
}
