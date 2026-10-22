import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './Dto/createUserDto';
import { ListAllAvailableMaidsDto } from './Dto/listAllAvailableMaidsDto';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Get()
   async getUsers(): Promise<Object> {
      let result =  await this.usersService.findAll();
      return result;
    }

    @Get('listAllAvailableMaids')
    async listAllAvailableMaids(
      @Query() query: ListAllAvailableMaidsDto,
    ): Promise<Object> {
      return this.usersService.listAllAvailableMaids(query);
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
