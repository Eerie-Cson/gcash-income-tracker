import { Inject, Injectable } from '@nestjs/common';
import { Account, CreateAccountRequest } from '../libs/types/account';
import { AccountRepository } from './repository/account.repository';
import { Token } from './repository/token';

@Injectable()
export class AccountService {
  constructor(
    @Inject(Token.AccountRepository)
    private readonly accountRepository: AccountRepository,
  ) {}

  async create(params: CreateAccountRequest): Promise<Account> {
    return this.accountRepository.create({
      data: {
        email: params.email,
        password: params.password,
        name: params.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findByEmail(email: string) {
    return this.accountRepository.find({ email });
  }
}
