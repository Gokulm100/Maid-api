import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import {CreateUserDto} from './Dto/createUserDto'
import { ResponseObject } from 'response.builder';
const bcrypt = require('bcrypt');
require('dotenv').config(); // Load environment variables
const jwt = require('jsonwebtoken');
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Fetch all users
  async findAll(): Promise<ResponseObject> {
    try {
      const users = await this.userModel.find().exec();
      let response = {
        message : "Users fetched successfully!",
        data :users
      }
      return response;
    } catch (error) {
      let response = {
        message : "Failed to fetch user data!",
        data :[],
        error:error.message

      }
      return response;
    }
  }

  // Fetch one user by ID
  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<ResponseObject> {
    try {
      let saltRounds = 10;
      const password =  await bcrypt.hash(createUserDto.password, saltRounds);
      createUserDto.password = password;
      const createdUser = new this.userModel(createUserDto);
      let result = await createdUser.save();
      let response = {
        message : "User created successfully!",
        data :result
      }
      return response;
    } catch (error) {
      console.log("er",error)
      let response = {
        message : "User creation failed!",
        data :[],
        error:error.message

      }
      return response;
    }

  }
  async login(params): Promise<ResponseObject> {
    try {
      let username= params.username;
      let password= params.password;

      let response ={}
      let user = await this.userModel.findOne({email:username}).exec();
      if(user){
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const SECRET_KEY = process.env.SECRET_KEY;
            const expiresIn = process.env.expiresIn;
            const payload = {
              id: user._id.toString(), // Convert ObjectId to string
              name: user.name,
              email: user.email,
              userType: user.userType,
            };
            
            const options = {
                expiresIn: '1h', // Token validity duration (e.g., 1 hour)
            };
          const token = jwt.sign(payload, SECRET_KEY, options);
          response = {
            message : "Login successfull!",
            data :{user:user,token:token}
          }
        } else {
          response = {
            message : "Incorrect Password!",
            data :[]
          }
        }

      }else{
         response = {
          message : "User does not exist!",
          data :[]
        }
      }
      return response;
    } catch (error) {
      console.log("er",error)
      let response = {
        message : "Login failed!",
        data :[],
        error:error.message

      }
      return response;
    }

  }
  // Update a user
  async update(id: string, updateUserDto: any): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  // Delete a user
  async remove(id: string): Promise<any> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
