import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountRepository } from './repository/account.repository';
import { Token } from './repository/token';

@Module({
  controllers: [AccountController],
  providers: [
    { provide: Token.AccountRepository, useClass: AccountRepository },
    AccountService,
  ],
  exports: [AccountService],
})
export class AccountModule {}
