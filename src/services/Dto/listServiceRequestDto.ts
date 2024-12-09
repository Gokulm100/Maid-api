import { ObjectId } from "mongoose";


export class listServiceRequestDto {

    name: string;
    from: string;
    to: string;
    serviceRequired:ObjectId;
    createdBy:ObjectId;
    acceptedBy?:ObjectId
  }
  