import { Controller, Get, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { User } from './user/user.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index(@Res() res: Response, @Session() session: { user?: User }): void {
    this.appService.gateway(res, session);
  }

  @Get('/register')
  register(@Res() res: Response): void {
    res.redirect('/register.html');
  }
}
