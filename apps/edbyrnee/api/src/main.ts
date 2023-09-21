/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

import * as fs from 'fs';
import * as path from 'path';

// // These two redundant imports are needed to ensure nx imports all required peer transitive dependencies when building for production
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import * as passport from 'passport'; // Used by Auth (@nestjs/passport)
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import * as classtransformer from 'class-transformer'; // Used by Auth (bcrypt-nodejs)
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import * as swaggeruiexpress from 'swagger-ui-express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as mysql2 from 'mysql2';
// // eslint-disable-next-line @typescript-eslint/no-unused-vars

async function bootstrap() {
  const defaultKeyFileeir = path.join(__dirname, 'assets', 'private.pem');

  const defaultCertFileDir = path.join(__dirname, 'assets', 'public.pem');

  const keyFile = fs.readFileSync(defaultKeyFileeir);
  const certFile = fs.readFileSync(defaultCertFileDir);

  const app = await NestFactory.create(AppModule, {
    // httpsOptions: {
    //   key: keyFile,
    //   cert: certFile,
    // },
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidUnknownValues: false
    })
  );
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
