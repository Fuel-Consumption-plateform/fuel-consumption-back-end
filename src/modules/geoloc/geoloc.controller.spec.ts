import { Test, TestingModule } from '@nestjs/testing';
import { GeolocController } from './geoloc.controller';

describe('GeolocController', () => {
  let controller: GeolocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeolocController],
    }).compile();

    controller = module.get<GeolocController>(GeolocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
