import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Types } from 'mongoose';
import { User } from './user.schema'; // Import the ServiceType model
import { Service } from './services.schema'; // Import the ServiceType model

export type ServiceRequestDocument = ServiceRequest & Document;
@Schema()
export class ServiceRequest {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true})
  from: Date;

  @Prop({ required: true })
  to: Date;
 
  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  serviceRequired: Service;
  
  @Prop({ required: true, default: () => new Date() })
  createdAt: Date;

  @Prop({ required: false, default: () => new Date() })
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  acceptedBy: User;
}


export const ServiceRequestSchema = SchemaFactory.createForClass(ServiceRequest);
ServiceRequestSchema.index({ name: 1 }, { unique: true });
