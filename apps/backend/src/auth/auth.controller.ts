import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() body: { email: string; password: string; name: string },
  ) {
    return this.auth.register(body.email, body.password, body.name);
  }
}
