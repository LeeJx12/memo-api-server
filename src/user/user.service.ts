import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDTO } from './user.schema';
import * as md5 from 'md5';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, @InjectConnection() private connection: mongoose.Connection) {}
    
    async getUser(loginId: string): Promise<any> {
        try {
            const result = await this.userModel.findOne({loginId}).lean();

            return result;
        } catch (e) {
            console.error(e);
        }
    }

    async getUserByUserId(userId: string): Promise<any> {
        try {
            const result = await this.userModel.findOne({userId}).lean();

            return result;
        } catch (e) {
            console.error(e);
        }
    }

    async addUser(user: UserDTO): Promise<User> {
        const session = await this.connection.startSession();

        try {
            user.userId = uuid();
            user.password = md5(user.password);

            session.startTransaction();
            const response = await this.userModel.create(user);
            await session.commitTransaction();
            session.endSession();

            return response;
        } catch (e) {
            await session.abortTransaction();
            session.endSession();
            console.error(e);
        }
        
    }
}
