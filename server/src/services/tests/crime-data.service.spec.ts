import { Test, TestingModule } from '@nestjs/testing';
import { CrimeDataService } from '../services/crime-data.service';

describe('CrimeDataService', () => {
  let service: CrimeDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrimeDataService],
    }).compile();

    service = module.get<CrimeDataService>(CrimeDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
