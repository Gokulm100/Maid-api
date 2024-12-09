import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Types } from 'mongoose';
import { ServiceType } from './ServiceType.schema'; // Import the ServiceType model

export type ServiceDocument = Service & Document;
@Schema()
export class Service {
  @Prop({ required: true,unique:true })
  name: string;

  @Prop({ required: true, default: () => new Date() })
  createdAt: Date;

  @Prop({ required: false, default: () => new Date() })
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'ServiceType', required: true })
  serviceType: ServiceType;
}


export const ServiceSchema = SchemaFactory.createForClass(Service);
ServiceSchema.index({ name: 1 }, { unique: true });
