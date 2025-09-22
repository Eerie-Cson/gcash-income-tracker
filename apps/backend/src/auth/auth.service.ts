import {
  ConflictException,
  Injectable,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountService } from '../account/account.service';
import { Account } from '../libs/types';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}
  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; account: Account }> {
    const account = await this.accountService.findByEmail(email);

    if (!account) throw new UnauthorizedException('Invalid credentials');

    await this.validatePassword(password, account.password);

    const payload = {
      sub: account.id,
      email: account.email,
      // role: account.role,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '3h' });
    return { accessToken: token, account };
  }

  async register(email: string, password: string, name: string) {
    const existingAccount = await this.accountService.findByEmail(email);

    if (existingAccount) throw new ConflictException('Account already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const account = await this.accountService.create({
      email,
      password: hashedPassword,
      name,
    });

    if (!account) throw new NotImplementedException('Account creation failed');

    const payload = { sub: account.id, email: account.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '3h' });

    return { accessToken, account };
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const valid = await bcrypt.compare(password, hashedPassword);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return;
  }
}
