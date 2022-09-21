import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MemoModule } from './memo/memo.module';
import { SessionModule } from 'nestjs-session';
import { CommentModule } from './comment/comment.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    SessionModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        session: { secret: configService.get<string>('SESSION_KEY') }
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/',
      rootPath: join(__dirname, '..', 'public'),
    }),
    UserModule,
    MemoModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
