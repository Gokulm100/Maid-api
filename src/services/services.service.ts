import { Injectable } from '@nestjs/common';
import { ServiceRequest, ServiceRequestDocument } from 'schemas/serviceRequest.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose, ObjectId,Types } from 'mongoose';
import { createServiceRequestDto } from './Dto/createServiceRequestDto';
import { updateServiceRequestDto } from './Dto/updateServiceRequestDto';
import { listServiceRequestDto } from './Dto/listServiceRequestDto';
import { ResponseObject } from 'response.builder';

@Injectable()
export class ServicesService {
  constructor(@InjectModel(ServiceRequest.name) private ServiceRequestModel: Model<ServiceRequestDocument>) { }

  async create(params: createServiceRequestDto): Promise<ResponseObject> {
    try {
      // params.serviceRequired = new Types.ObjectId(params.serviceRequired);
      // params.createdBy = new Types.ObjectId(params.createdBy);
      // params.acceptedBy = params.acceptedBy ? new Types.ObjectId(params.acceptedBy) : undefined;
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
  async update(id: ObjectId, params: updateServiceRequestDto): Promise<ResponseObject> {
    try {
      const result = await this.ServiceRequestModel.findByIdAndUpdate(
        id,
        { ...params, updatedAt: new Date() }, 
        { new: true }
      );

      if (!result) {
        return {
          message: 'Service request not found!',
          data: [],
          error: 'NotFound',
        };
      }
      return {
        message: 'Service request updated successfully!',
        data: result,
        error: null,
      };
    } catch (error) {
      console.error('Error updating service request:', error);
      return {
        message: 'Service request updation failed!',
        data: [],
        error: error.message,
      };
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
            from: "users",          
            localField: "acceptedBy", 
            foreignField: "_id",     
            as: "acceptor"         
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
          $unwind: { path: "$acceptor", preserveNullAndEmptyArrays: true } 
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
            creatorId:"$creator._id",  
            acceptorName:"$acceptor.name",    
            accesptorId:"$acceptor._id"  
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
