import { Test, TestingModule } from '@nestjs/testing';
import { CrimeDataController } from './crime-data.controller';

describe('CrimeDataController', () => {
  let controller: CrimeDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrimeDataController],
    }).compile();

    controller = module.get<CrimeDataController>(CrimeDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
