import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDTO } from './user.schema';
import * as md5 from 'md5';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    
    async getUser(loginId: string): Promise<any> {
        try {
            const result = await this.userModel.findOne({loginId}).lean();

            return result;
        } catch (e) {
            console.log(e);
        }
    }

    async getUserByUserId(userId: string): Promise<any> {
        try {
            const result = await this.userModel.findOne({userId}).lean();

            return result;
        } catch (e) {
            console.log(e);
        }
    }

    async addUser(user: UserDTO): Promise<User> {
        user.userId = uuid();
        user.password = md5(user.password);
        return await this.userModel.create(user);
    }
}
