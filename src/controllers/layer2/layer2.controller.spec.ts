import { Test, TestingModule } from '@nestjs/testing';
import { Layer2Controller } from './layer2.controller';

describe('Layer2Controller', () => {
  let controller: Layer2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Layer2Controller],
    }).compile();

    controller = module.get<Layer2Controller>(Layer2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
