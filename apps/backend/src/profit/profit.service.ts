import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProfitRepository } from './repository/profit.repository';
import { Token } from './repository/token';
import { CreateTierRequest } from '../libs/types/profit';
import { AccountService } from '../account/account.service';

@Injectable()
export class ProfitService {
  constructor(
    @Inject(Token.ProfitRepository)
    private readonly profitRepository: ProfitRepository,
    private accountService: AccountService,
  ) {}

  async saveProfitTiers(accountId: string, profitTiers: CreateTierRequest[]) {
    await this.profitRepository.executeTransactions(async (client) => {
      const account = await this.accountService.findById(accountId);

      if (!account) {
        throw new NotFoundException('Account not found');
      }

      await this.profitRepository.delete(client);
      for (const tier of profitTiers) {
        await this.profitRepository.createProfitTier(client, {
          ...tier,
          accountId,
        });
      }
    });
  }

  async deleteAllTiers(accountId: string) {
    await this.profitRepository.delete({ filter: { accountId } });
  }

  async getTiers(accountId: string) {
    return this.profitRepository.fetch({ accountId });
  }
}
