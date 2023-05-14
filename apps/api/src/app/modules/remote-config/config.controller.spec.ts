import { Test, TestingModule } from '@nestjs/testing';
import { RemoteConfigController } from './remote-config.controller';

describe('ConfigController', () => {
  let controller: RemoteConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemoteConfigController],
    }).compile();

    controller = module.get<RemoteConfigController>(RemoteConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
