// import {
//   Controller,
//   Post,
//   UploadedFiles,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileService } from './file.service';
// import 'multer';
// import { AnyFilesInterceptor } from '@nestjs/platform-express';
// import { ApiOperation } from '@nestjs/swagger';

// @Controller('files')
// export class FilesController {
//   constructor(private filesService: FileService) {}

//   @Post('upload')
//   @ApiOperation({
//     summary:
//       'Upload an array of files to pre-specified bucket (default-bucket) with the key specified by the field name',
//   })
//   @UseInterceptors(AnyFilesInterceptor())
//   upsertFilesByFieldName(@UploadedFiles() files: Array<Express.Multer.File>) {
//     this.filesService.upsertFileArray(files, 'default-bucket');
//   }
// }
