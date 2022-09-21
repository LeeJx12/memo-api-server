import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { MemoController } from './memo.controller';
import { Memo, MemoSchema } from './memo.schema';
import { MemoService } from './memo.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Memo.name, schema: MemoSchema}])],
  controllers: [MemoController],
  providers: [MemoService],
  exports: [MemoService]
})
export class MemoModule {}
