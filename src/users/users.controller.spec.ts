import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Gender } from '../../schemas/user.schema';

describe('UsersController', () => {
  let controller: UsersController;

  const listAllAvailableMaidsMock = jest.fn();

  beforeEach(async () => {
    listAllAvailableMaidsMock.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            login: jest.fn(),
            listAllAvailableMaids: listAllAvailableMaidsMock,
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listAllAvailableMaids', () => {
    it('delegates to the service with query filters', async () => {
      const query = { name: 'Jane', gender: Gender.Female };
      const response = {
        message: 'Available maids fetched successfully!',
        data: [],
      };
      listAllAvailableMaidsMock.mockResolvedValue(response);

      const result = await controller.listAllAvailableMaids(query);

      expect(listAllAvailableMaidsMock).toHaveBeenCalledWith(query);
      expect(result).toEqual(response);
    });
  });
});
