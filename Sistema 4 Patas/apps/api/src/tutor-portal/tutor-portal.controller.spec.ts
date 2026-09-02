import { Test, TestingModule } from '@nestjs/testing';
import { TutorPortalController } from './tutor-portal.controller';
import { TutorPortalService } from './tutor-portal.service';

describe('TutorPortalController', () => {
  let controller: TutorPortalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TutorPortalController],
      providers: [
        {
          provide: TutorPortalService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TutorPortalController>(TutorPortalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
