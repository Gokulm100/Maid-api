import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from '../../schemas/user.schema';
import { Gender, Usertype } from '../../schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;

  const mockMaid = {
    _id: 'maid1',
    name: 'Jane Maid',
    userType: Usertype.Maid,
    gender: Gender.Female,
    email: 'jane@example.com',
  };

  const execMock = jest.fn();
  const selectMock = jest.fn(() => ({ exec: execMock }));
  const findMock = jest.fn(() => ({ select: selectMock }));

  beforeEach(async () => {
    execMock.mockReset();
    selectMock.mockClear();
    findMock.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: { find: findMock },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listAllAvailableMaids', () => {
    it('queries Maid users and omits passwords', async () => {
      execMock.mockResolvedValue([mockMaid]);

      const result = await service.listAllAvailableMaids();

      expect(findMock).toHaveBeenCalledWith({ userType: Usertype.Maid });
      expect(selectMock).toHaveBeenCalledWith('-password');
      expect(result.message).toBe('Available maids fetched successfully!');
      expect(result.data).toEqual([mockMaid]);
    });

    it('applies optional name and gender filters', async () => {
      execMock.mockResolvedValue([mockMaid]);

      await service.listAllAvailableMaids({
        name: 'Jane',
        gender: Gender.Female,
        from: '2025-01-01',
        to: '2025-01-31',
      });

      expect(findMock).toHaveBeenCalledWith({
        userType: Usertype.Maid,
        gender: Gender.Female,
        name: { $regex: 'Jane', $options: 'i' },
      });
    });

    it('returns error payload when the query fails', async () => {
      execMock.mockRejectedValue(new Error('db down'));

      const result = await service.listAllAvailableMaids();

      expect(result.message).toBe('Failed to fetch available maids!');
      expect(result.data).toEqual([]);
      expect(result.error).toBe('db down');
    });
  });
});
