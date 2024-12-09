import { Controller,Post,Body,Get, Param } from '@nestjs/common';
import {ServicesService} from './services.service'
import {createServiceRequestDto} from './Dto/createServiceRequestDto'
import {listServiceRequestDto} from './Dto/listServiceRequestDto'
import { ObjectId } from 'mongoose';


@Controller('services')
export class ServicesController {
    constructor(private readonly ServicesService: ServicesService) {}

    @Post('createServiceRequest')
    async createServiceRequest(@Body() createServiceRequest: createServiceRequestDto): Promise<Object> {
        const result = await this.ServicesService.create(createServiceRequest);
        return result  
      }

      @Get('getServiceRequest/:id')
      async listSingleServiceRequest(@Param('id') id: ObjectId): Promise<Object> {
          const result = await this.ServicesService.listOne(id);
          return result  
        }   
        @Post('listServiceRequest')
        async listServiceRequest(@Body() listServiceRequest: listServiceRequestDto): Promise<Object> {
            const result = await this.ServicesService.list(listServiceRequest);
            return result  
          }      
}
