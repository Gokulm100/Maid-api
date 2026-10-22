import { UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from './auth.middleware';

describe('AuthMiddleware (GET /users/listAllAvailableMaids)', () => {
  const middleware = new AuthMiddleware();
  const next: NextFunction = jest.fn();
  const res = {} as Response;

  beforeEach(() => {
    (next as jest.Mock).mockClear();
    process.env.SECRET_KEY = 'test-secret';
  });

  it('returns 401 when Authorization token is missing', () => {
    const req = { headers: {} } as Request;

    expect(() => middleware.use(req, res, next)).toThrow(UnauthorizedException);
    expect(() => middleware.use(req, res, next)).toThrow('Token is required');
    expect(next as jest.Mock).not.toHaveBeenCalled();
  });

  it('returns 401 when Bearer token is invalid', () => {
    const req = {
      headers: { authorization: 'Bearer not-a-valid-jwt' },
    } as Request;

    expect(() => middleware.use(req, res, next)).toThrow(UnauthorizedException);
    expect(() => middleware.use(req, res, next)).toThrow('Invalid token');
    expect(next as jest.Mock).not.toHaveBeenCalled();
  });
});
