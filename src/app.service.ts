import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { User } from './user/user.schema';

@Injectable()
export class AppService {
  gateway(res: Response, session: { user?: User }): void {
    const nextPage = session.user ? '/main.html' : '/login.html';

    res.redirect(nextPage);
  }
}
