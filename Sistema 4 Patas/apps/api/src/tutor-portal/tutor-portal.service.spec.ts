import { Test, TestingModule } from '@nestjs/testing';
import { TutorPortalService } from './tutor-portal.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TutorPortalService', () => {
  let service: TutorPortalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TutorPortalService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TutorPortalService>(TutorPortalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
