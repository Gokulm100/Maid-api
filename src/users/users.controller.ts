import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './Dto/createUserDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('maids')
  async listAvailableMaids(@Req() req: Request): Promise<Object> {
    const caller = req['user'] as { userType?: string } | undefined;
    if (caller?.userType !== 'Customer') {
      throw new ForbiddenException('Only customers can list maids');
    }
    return this.usersService.findAvailableMaids();
  }

  @Get()
  async getUsers(): Promise<Object> {
      let result =  await this.usersService.findAll();
      return result;
    }
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<Object> {
      const result = await this.usersService.create(createUserDto);
      return result  
    }
    @Post('/login')
    async login(@Body() Param:Object): Promise<Object> {
      console.log(Param)
      const result = await this.usersService.login(Param);
      return result  
    }    
}
