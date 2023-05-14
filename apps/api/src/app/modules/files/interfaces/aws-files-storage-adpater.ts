// import {
//   DeleteObjectCommand,
//   DeleteObjectCommandInput,
//   DeleteObjectCommandOutput,
//   GetObjectCommand,
//   GetObjectCommandInput,
//   GetObjectCommandOutput,
//   PutObjectCommand,
//   PutObjectCommandOutput,
//   S3,
// } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { Inject } from '@nestjs/common';
// import { IFileStoragePort } from './file-storage-port.interface';
// import { IUploadResult } from './upload-result.interface';

// export class AWSFileStorageAdapter implements IFileStoragePort {
//   constructor(@Inject('S3_INSTANCE') private s3: S3) {}

//   public putFile(
//     bucketName: string,
//     body: Buffer,
//     fileKey: string
//   ): Promise<IUploadResult> {
//     const params = {
//       Bucket: bucketName,
//       Key: fileKey,
//       Body: body,
//     };

//     return this.s3
//       .send(new PutObjectCommand(params))
//       .then((res: PutObjectCommandOutput) => {
//         return {
//           fileUrl: `https://${bucketName}.s3.eu-west-1.amazonaws.com/${fileKey}`,
//         };
//       });
//   }

//   public deleteFromBucket(
//     bucketName: string,
//     fileName: string
//   ): Promise<boolean> {
//     const params: DeleteObjectCommandInput = {
//       Bucket: bucketName,
//       Key: fileName,
//     };

//     return this.s3
//       .send(new DeleteObjectCommand(params))
//       .then((res: DeleteObjectCommandOutput) => {
//         return res.$metadata.httpStatusCode === 204;
//       });
//   }

//   public async getFile(bucketName: string, fileKey: string): Promise<any> {
//     const req: GetObjectCommandInput = {
//       Bucket: bucketName,
//       Key: fileKey,
//     };

//     return this.s3
//       .send(new GetObjectCommand(req))
//       .then((res: GetObjectCommandOutput) => {
//         return res.Body;
//       });
//   }

//   public generatePresignedUrl(
//     bucketName: string,
//     fileKey: string
//   ): Promise<string> {
//     const getObjectParams: GetObjectCommandInput = {
//       Bucket: bucketName,
//       Key: fileKey,
//     };
//     const command = new GetObjectCommand(getObjectParams);
//     return getSignedUrl(this.s3, command, { expiresIn: 3600 });
//   }
// }
