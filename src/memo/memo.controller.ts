import { BadRequestException, Body, Controller, Post, Get, Put, Delete, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { UpdateWriteOpResult } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { Memo, MemoDTO } from './memo.schema';
import { MemoService } from './memo.service';

@Controller('memo')
export class MemoController {
    constructor(private memoService: MemoService, private userService: UserService) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
    async createMemo(@Body() memo: MemoDTO): Promise<Memo> {
        const isUserExist = await this.userService.getUserByUserId(memo.userId);

        if (!isUserExist) {
            throw new BadRequestException('사용자 정보가 존재하지 않습니다.');
        } else {
            return await this.memoService.addMemo(memo);
        }
    }

    @Get('/list/:pageId/:listCnt')
    async listMemo(@Param() params: {[key: string]: number}): Promise<Array<Memo>> {
        const { pageId, listCnt } = params;

        return await this.memoService.listMemo(pageId, listCnt);
    }

    @Get('/:memoId')
    async getMemo(@Param() params: { [key: string]: string }): Promise<Memo> {
        const memo = await this.memoService.getMemo(params.memoId);

        if (!memo) {
            throw new BadRequestException('메모가 존재하지 않습니다!');
        } else {
            return memo;
        }
    }

    @Put('/:memoId')
    async editMemo(@Body() memo: MemoDTO, @Param() params: { [key: string]: string }): Promise<UpdateWriteOpResult> {
        const { memoId } = params;

        const orgMemo = await this.memoService.getMemo(params.memoId);

        if (!orgMemo) {
            throw new BadRequestException('메모가 존재하지 않습니다!');
        } else {
            const newMemo = await this.memoService.editMemo(memo);

            return newMemo;
        }
    }

    @Delete('/:memoId')
    async deleteMemo(@Param() params: { [key: string]: string }) {
        const memo = await this.memoService.getMemo(params.memoId);

        if (!memo) {
            throw new BadRequestException('메모가 존재하지 않습니다!');
        } else {
            return await this.memoService.delMemo(memo);
        }
    }
}