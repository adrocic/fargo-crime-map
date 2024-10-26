import { Test, TestingModule } from '@nestjs/testing';
import { MaptilesService } from './maptiles.service';

describe('MaptilesService', () => {
  let service: MaptilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaptilesService],
    }).compile();

    service = module.get<MaptilesService>(MaptilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
