import { BadRequestException, Body, Controller, Post, Get, Put, Delete, Param, UsePipes, ValidationPipe, Session } from '@nestjs/common';
import { UpdateWriteOpResult } from 'mongoose';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { Memo, MemoDTO } from './memo.schema';
import { MemoService } from './memo.service';
import { v4 as uuid } from 'uuid';

@Controller('memo')
export class MemoController {
    constructor(private memoService: MemoService, private userService: UserService) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
    async createMemo(@Body() memo: MemoDTO, @Session() session: {user?: User}): Promise<Memo> {
        if (!session.user) {
            throw new BadRequestException('세션이 만료되었습니다.');
        }

        memo.memoId = uuid();
        memo.userId = session.user.userId.toString();
        const isUserExist = await this.userService.getUserByUserId(memo.userId);

        if (!isUserExist) {
            throw new BadRequestException('사용자 정보가 존재하지 않습니다.');
        } else {
            return await this.memoService.addMemo(memo);
        }
    }

    @Get('/list/:pageId/:listCnt')
    async listMemo(@Param() params: {[key: string]: number}, @Session() session: {user?: User}): Promise<Array<Memo>> {
        if (!session.user) {
            throw new BadRequestException('세션이 만료되었습니다.');
        }

        const { pageId, listCnt } = params;

        return await this.memoService.listMemo(pageId, listCnt);
    }

    @Get('/:memoId')
    async getMemo(@Param() params: { [key: string]: string }, @Session() session: {user?: User}): Promise<Memo> {
        if (!session.user) {
            throw new BadRequestException('세션이 만료되었습니다.');
        }
        
        const memo = await this.memoService.getMemo(params.memoId);

        if (!memo) {
            throw new BadRequestException('메모가 존재하지 않습니다!');
        } else {
            return memo;
        }
    }

    @Put('/:memoId')
    async editMemo(@Body() memo: MemoDTO, @Param() params: { [key: string]: string }, @Session() session: {user?: User}): Promise<UpdateWriteOpResult> {
        if (!session.user) {
            throw new BadRequestException('세션이 만료되었습니다.');
        }

        const orgMemo = await this.memoService.getMemo(params.memoId);

        if (!orgMemo) {
            throw new BadRequestException('메모가 존재하지 않습니다!');
        } else if (orgMemo.userId !== session.user.userId.toString()) {
            throw new BadRequestException('작성자만 수정할 수 있습니다!');
        } else {
            const newMemo = await this.memoService.editMemo(memo);

            return newMemo;
        }
    }

    @Delete('/:memoId')
    async deleteMemo(@Param() params: { [key: string]: string }, @Session() session: {user?: User}) {
        if (!session.user) {
            throw new BadRequestException('세션이 만료되었습니다.');
        }

        const memo = await this.memoService.getMemo(params.memoId);

        if (!memo) {
            throw new BadRequestException('메모가 존재하지 않습니다!');
        } else if (memo.userId !== session.user.userId.toString()) {
            throw new BadRequestException('작성자만 삭제할 수 있습니다!');
        } else {
            return await this.memoService.delMemo(memo);
        }
    }
}