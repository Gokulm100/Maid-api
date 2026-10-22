import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
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
    it('queries only Maid users and omits passwords', async () => {
      execMock.mockResolvedValue([mockMaid]);

      const result = await service.listAllAvailableMaids();

      expect(findMock).toHaveBeenCalledWith({ userType: Usertype.Maid });
      expect(selectMock).toHaveBeenCalledWith('-password');
      expect(result.message).toBe('Available maids fetched successfully!');
      expect(result.data).toEqual([mockMaid]);
      expect(
        result.data.every((user) => user.userType === Usertype.Maid),
      ).toBe(true);
      expect(findMock).not.toHaveBeenCalledWith(
        expect.objectContaining({ userType: Usertype.Customer }),
      );
    });

    it('returns success with empty data when no maids match', async () => {
      execMock.mockResolvedValue([]);

      const result = await service.listAllAvailableMaids();

      expect(result.message).toBe('Available maids fetched successfully!');
      expect(result.data).toEqual([]);
    });

    it('applies optional name and gender filters', async () => {
      execMock.mockResolvedValue([mockMaid]);

      await service.listAllAvailableMaids({
        name: 'Jane',
        gender: Gender.Female,
      });

      expect(findMock).toHaveBeenCalledWith({
        userType: Usertype.Maid,
        gender: Gender.Female,
        name: { $regex: 'Jane', $options: 'i' },
      });
    });

    it('rejects when from query parameter is sent', async () => {
      await expect(
        service.listAllAvailableMaids({ from: '2025-01-01' }),
      ).rejects.toThrow(BadRequestException);
      expect(findMock).not.toHaveBeenCalled();
    });

    it('rejects when to query parameter is sent', async () => {
      await expect(
        service.listAllAvailableMaids({ to: '2025-01-31' }),
      ).rejects.toThrow(BadRequestException);
      expect(findMock).not.toHaveBeenCalled();
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
