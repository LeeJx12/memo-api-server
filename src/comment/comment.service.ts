import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, UpdateWriteOpResult } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Comment, CommentDTO } from './comment.schema';

@Injectable()
export class CommentService {
    constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>, @InjectConnection() private connection: mongoose.Connection) {}

    async getComment(commentId: string): Promise<Comment> {
        return await this.commentModel.findOne({commentId});
    }

    listComment(memoId: string): Promise<Array<Comment>> {
        return new Promise((resolve, reject) => {
            this.commentModel
                .find({memoId: memoId})
                .sort({createdAt: 'asc'})
                .then(resolve)
                .catch(reject);
        });
    }

    async addComment(comment: CommentDTO): Promise<Comment> {
        const session = await this.connection.startSession();

        try {
            comment.commentId = uuid();
            
            session.startTransaction();
            const response = await this.commentModel.create(comment);
            await session.commitTransaction();
            session.endSession();

            return response;
        } catch (e) {
            await session.abortTransaction();
            session.endSession();
            console.error(e);
        }
    }

    async editComment(comment: CommentDTO): Promise<UpdateWriteOpResult> {
        const session = await this.connection.startSession();

        try {
            session.startTransaction();
            const response = await this.commentModel.replaceOne({commentId: comment.commentId}, comment);
            await session.commitTransaction();
            session.endSession();

            return response;
        } catch (e) {
            await session.abortTransaction();
            session.endSession();
            console.error(e);
        }
    }

    async delComment(comment: CommentDTO): Promise<any> {
        const session = await this.connection.startSession();

        try {
            session.startTransaction();
            const response = await this.commentModel.deleteOne({commentId: comment.commentId});
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
