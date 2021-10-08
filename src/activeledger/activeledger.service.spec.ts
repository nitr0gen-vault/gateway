import { Test, TestingModule } from '@nestjs/testing';
import { ActiveledgerService } from './activeledger.service';

describe('ActiveledgerService', () => {
  let service: ActiveledgerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActiveledgerService],
    }).compile();

    service = module.get<ActiveledgerService>(ActiveledgerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
