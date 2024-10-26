import { Test, TestingModule } from '@nestjs/testing';
import { CouchDbService } from '../couchdb/couchdb.service';

describe('CrimeDataService', () => {
  let service: CouchDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouchDbService],
    }).compile();

    service = module.get<CouchDbService>(CouchDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
