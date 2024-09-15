import { Test, TestingModule } from '@nestjs/testing';
import { DispatchcronService } from './dispatchcron.service';

describe('DispatchcronService', () => {
  let service: DispatchcronService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DispatchcronService],
    }).compile();

    service = module.get<DispatchcronService>(DispatchcronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
