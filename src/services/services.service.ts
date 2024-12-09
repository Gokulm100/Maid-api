import { Injectable } from '@nestjs/common';
import { ServiceRequest, ServiceRequestDocument } from 'schemas/serviceRequest.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose, ObjectId } from 'mongoose';
import { createServiceRequestDto } from './Dto/createServiceRequestDto';
import { listServiceRequestDto } from './Dto/listServiceRequestDto';
import { ResponseObject } from 'response.builder';
@Injectable()
export class ServicesService {
  constructor(@InjectModel(ServiceRequest.name) private ServiceRequestModel: Model<ServiceRequestDocument>) { }

  async create(params: createServiceRequestDto): Promise<ResponseObject> {
    try {
      const createdRequest = new this.ServiceRequestModel(params);
      let result = await createdRequest.save();
      let response = {
        message: "Service request created successfully!",
        data: result
      }
      return response;
    } catch (error) {
      console.log("er", error)
      let response = {
        message: "Service request creation failed!",
        data: [],
        error: error.message

      }
      return response;
    }

  }
  async listOne(id: ObjectId): Promise<ResponseObject> {
    try {
      const serviceRequests = await this.ServiceRequestModel.findById(id).populate({
        path: 'serviceRequired',
        select: 'name',
        options: { sort: { name: 1 } }
      })
        .exec();
      let response = {
        message: "Service request listed successfully!",
        data: serviceRequests
      }
      return response;
    } catch (error) {
      console.log("er", error)
      let response = {
        message: "Service request listing failed!",
        data: [],
        error: error.message

      }
      return response;
    }

  }
  async list(params: listServiceRequestDto): Promise<ResponseObject> {
    try {
      const serviceRequests = await this.ServiceRequestModel.aggregate([
        {
          $match: { name: { $ne: null } }
        },
        {
          $lookup: {
            from: "users",          
            localField: "createdBy", 
            foreignField: "_id",     
            as: "creator"         
          }
        },
        {
          $lookup: {
            from: "services",          
            localField: "serviceRequired", 
            foreignField: "_id",     
            as: "services"         
          }
        },
        {
          $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } 
        },
        {
          $unwind: { path: "$services", preserveNullAndEmptyArrays: true } 
        },
        {
        
          $sort: { name: -1 } 
        },
        {

          $project: {
            name: 1,        
            from: 1,             
            to: 1,               
            services: 1,    
            createdAt: 1,        
            updatedAt: 1, 
            creatorName:"$creator.name",    
            creatorId:"$creator._id"  
          }
        }
      ]);
      
      let response = {
        message: "Service request listed successfully!",
        data: serviceRequests
      }
      return response;
    } catch (error) {
      console.log("er", error)
      let response = {
        message: "Service request listing failed!",
        data: [],
        error: error.message

      }
      return response;
    }
  }
}
