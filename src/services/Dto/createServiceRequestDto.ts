import { ObjectId } from "mongoose";


export class createServiceRequestDto {

    name: string;
    from: string;
    to: string;
    serviceRequired:ObjectId;
    createdBy:ObjectId;
    acceptedBy?:ObjectId
  }
  