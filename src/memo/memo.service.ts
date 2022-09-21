import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, UpdateWriteOpResult } from 'mongoose';
import { Memo, MemoDTO } from './memo.schema';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MemoService {
    constructor(@InjectModel(Memo.name) private memoModel: Model<Memo>, @InjectConnection() private connection: mongoose.Connection) {}

    async getMemo(memoId: string): Promise<any> {
        try {
            const result = await this.memoModel.findOne({memoId}).lean();

            return result;
        } catch (e) {
            console.error(e);
        }
    }

    listMemo(pageId: number, listCnt: number): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            this.memoModel
                .find()
                .limit(listCnt)
                .skip(listCnt * (pageId - 1))
                .sort({
                    createdAt: 'desc'
                })
                .then(resolve)
                .catch(reject);
        });
    }

    async addMemo(memo: MemoDTO): Promise<Memo> {
        const session = await this.connection.startSession();

        try {
            memo.memoId = uuid();
            
            session.startTransaction();
            const response = await this.memoModel.create(memo);
            await session.commitTransaction();
            session.endSession();

            return response;
        } catch (e) {
            await session.abortTransaction();
            session.endSession();
            console.error(e);
        }
    }

    async editMemo(memo: MemoDTO): Promise<UpdateWriteOpResult> {
        const session = await this.connection.startSession();

        try {
            session.startTransaction();
            const response = await this.memoModel.replaceOne({memoId: memo.memoId}, memo);
            await session.commitTransaction();
            session.endSession();

            return response;
        } catch (e) {
            await session.abortTransaction();
            session.endSession();
            console.error(e);
        }
    }

    async delMemo(memo: MemoDTO): Promise<any> {
        const session = await this.connection.startSession();

        try {
            session.startTransaction();
            const response = await this.memoModel.deleteOne({memoId: memo.memoId});
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
