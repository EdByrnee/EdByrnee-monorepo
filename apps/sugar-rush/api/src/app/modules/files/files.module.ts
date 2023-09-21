import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { FileService } from './file.service';
import { fileModuleRepositoryProviders, FILE_STORAGE } from './files.providers';
import { Storage } from '@google-cloud/storage';
import { GCPFileStorageAdapter } from './interfaces/gcp-files-storage-adpater';
@Module({
  imports: [forwardRef(() => AuthModule), ConfigModule],
  providers: [
    {
      provide: FILE_STORAGE,
      useClass: GCPFileStorageAdapter,
    },
    {
      provide: 'GCP_STORAGE_INSTANCE',
      useFactory: () => {
        return new Storage();
      },
    },
    ...fileModuleRepositoryProviders,
    FileService,
  ],
  controllers: [],
  exports: [FileService, FILE_STORAGE],
})
export class FilesModule {}
