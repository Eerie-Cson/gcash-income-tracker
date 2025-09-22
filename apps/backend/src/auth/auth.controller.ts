import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { email: string; password: string }) {
    const { accessToken, account } = await this.auth.login(
      body.email,
      body.password,
    );
    if (!accessToken) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      };
    }
    return { accessToken, account };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() body: { email: string; password: string; name: string },
  ) {
    const { accessToken, account } = await this.auth.register(
      body.email,
      body.password,
      body.name,
    );
    if (!accessToken) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      };
    }
    return { accessToken, account };
  }
}
