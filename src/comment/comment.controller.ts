import { BadRequestException, Body, Controller, Post, Get, Put, Delete, Param, UsePipes, ValidationPipe, Session } from '@nestjs/common';
import { UpdateWriteOpResult } from 'mongoose';
import { MemoService } from 'src/memo/memo.service';
import { User } from 'src/user/user.schema';
import { Comment, CommentDTO } from './comment.schema';
import { CommentService } from './comment.service';
import { v4 as uuid } from 'uuid';

@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService, private memoService: MemoService) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
    async createComment(@Body() comment: CommentDTO, @Session() session: {user?: User}) {
        if (!session.user) {
            throw new BadRequestException('세션이 만료되었습니다.');
        }

        const memo = await this.memoService.getMemo(comment.memoId);

        if (!memo) {
            throw new BadRequestException('메모가 존재하지 않습니다.');
        }

        comment.commentId = uuid();
        comment.userId = session.user.userId.toString();
        comment.writerName = session.user.userName;

        return await this.commentService.addComment(comment);
    }

    @Get('/:memoId')
    async listComment(@Param() params: { [key: string]: string }, @Session() session: {user?: User}): Promise<Array<Comment>> {
        if (!session.user) {
            throw new BadRequestException('세션이 만료되었습니다.');
        }

        return await this.commentService.listComment(params.memoId);
    }

    @Put('/:commentId')
    async editComment(@Body() comment: CommentDTO, @Param() params: { [key: string]: string }, @Session() session: {user?: User}): Promise<UpdateWriteOpResult> {
        if (!session.user) {
            throw new BadRequestException('세션이 만료되었습니다.');
        }

        const orgComment = await this.commentService.getComment(params.commentId);

        if (!orgComment) {
            throw new BadRequestException('댓글이 존재하지 않습니다!');
        } else if (orgComment.userId !== session.user.userId.toString()) {
            throw new BadRequestException('작성자만 수정할 수 있습니다!');
        } else {
            const newComment = await this.commentService.editComment(comment);

            return newComment;
        }
    }

    @Delete('/:commentId')
    async deleteComment(@Param() params: { [key: string]: string }, @Session() session: {user?: User}) {
        if (!session.user) {
            throw new BadRequestException('세션이 만료되었습니다.');
        }

        const comment = await this.commentService.getComment(params.commentId);

        if (!comment) {
            throw new BadRequestException('댓글이 존재하지 않습니다!');
        } else if (comment.userId !== session.user.userId.toString()) {
            throw new BadRequestException('작성자만 삭제할 수 있습니다!');
        } else {
            return await this.commentService.delComment(comment);
        }
    }
}
