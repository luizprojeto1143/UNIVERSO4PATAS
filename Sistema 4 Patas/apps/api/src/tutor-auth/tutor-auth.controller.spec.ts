import { Test, TestingModule } from '@nestjs/testing';
import { TutorAuthController } from './tutor-auth.controller';
import { TutorAuthService } from './tutor-auth.service';

describe('TutorAuthController', () => {
  let controller: TutorAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TutorAuthController],
      providers: [
        {
          provide: TutorAuthService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TutorAuthController>(TutorAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
