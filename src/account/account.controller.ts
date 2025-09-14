import { Body, Controller, Post } from '@nestjs/common';
import { CreateAccountRequest } from '../libs/types/account';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() body: CreateAccountRequest) {
    return this.accountService.create(body);
  }
}
