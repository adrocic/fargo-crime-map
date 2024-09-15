import { Test, TestingModule } from '@nestjs/testing';
import { MaptilesController } from './maptiles.controller';

describe('MaptilesController', () => {
  let controller: MaptilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaptilesController],
    }).compile();

    controller = module.get<MaptilesController>(MaptilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
