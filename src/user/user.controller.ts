import { BadRequestException, Body, Controller, Post, Get, Param, UsePipes, ValidationPipe, Session } from '@nestjs/common';
import { User, UserDTO } from './user.schema';
import { UserService } from './user.service';
import * as md5 from 'md5';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
    async createUser(@Body() user: UserDTO): Promise<User> {
        const exists = await this.userService.getUser(user.loginId);

        if (exists) {
            throw new BadRequestException('이미 존재하는 사용자입니다.');
        } else {
            return await this.userService.addUser(user);
        }
    }

    @Get('/:userId')
    async getUser(@Param() params: { [key: string]: string }): Promise<User> {
        const user = await this.userService.getUserByUserId(params.userId);

        if (!user) {
            throw new BadRequestException('사용자가 존재하지 않습니다!');
        } else {
            return user;
        }
    }

    @Get('/session')
    getSessionUser(@Session() session: { user?: User }): User {
        return session.user;
    }

    @Post('/login')
    async login(@Body() user: User, @Session() session: { user?: User }): Promise<User> {
        const exists = await this.userService.getUser(user.loginId);

        if (!exists) {
            throw new BadRequestException('사용자가 존재하지 않습니다!');
        } else {
            const encrypt = md5(user.password);

            if (exists.password !== encrypt) {
                throw new BadRequestException('비밀번호가 틀렸습니다!');
            } else {
                session.user = exists;
                return exists;
            }
        }
    }
}