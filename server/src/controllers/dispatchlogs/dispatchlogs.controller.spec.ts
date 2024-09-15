import { Test, TestingModule } from '@nestjs/testing';
import { DispatchlogsController } from './dispatchlogs.controller';

describe('DispatchlogsController', () => {
  let controller: DispatchlogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DispatchlogsController],
    }).compile();

    controller = module.get<DispatchlogsController>(DispatchlogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
