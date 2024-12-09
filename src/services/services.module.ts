import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServiceRequest, ServiceRequestSchema } from 'schemas/serviceRequest.schema';
import { Service, ServiceSchema } from 'schemas/services.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesController } from './services.controller';
@Module({
  imports: [
    
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }, // Register Service model
      { name: ServiceRequest.name, schema: ServiceRequestSchema }]), 
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
