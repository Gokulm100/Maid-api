import { Controller,Get, Post,Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import {CreateUserDto} from './Dto/createUserDto'
import { User } from '../../schemas/user.schema';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
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
