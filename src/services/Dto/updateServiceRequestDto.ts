import { ObjectId } from "mongoose";


export class updateServiceRequestDto {
  name?: string;
  from?: string;
  to?: string;
  serviceRequired?:ObjectId;
  createdBy?:ObjectId;
  acceptedBy?:ObjectId
  }
  