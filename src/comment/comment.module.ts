import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemoModule } from 'src/memo/memo.module';
import { CommentController } from './comment.controller';
import { Comment, CommentSchema } from './comment.schema';
import { CommentService } from './comment.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]), MemoModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService]
})
export class CommentModule {}
