import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signIn')
  async signIn(@Req() req) {
    return this.authService.signIn(req.body);
  }

  @Post('signUp')
  async signUp(@Req() req) {
    return this.authService.signUp(req.body);
  }

  @Get('~')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req) {
    return this.authService.getMe(req.user.sub);
  }
}
