import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProfitRepository } from './repository/profit.repository';
import { Token } from './repository/token';
import { CreateTierRequest, ProfitTier } from '../libs/types/profit';
import { AccountService } from '../account/account.service';
import * as R from 'ramda';

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
        const { fee, ...profitTier } = tier;

        await this.profitRepository.createProfitTier(client, {
          ...profitTier,
          profit: tier.fee,
          accountId,
        });
      }
    });
  }

  async deleteAllTiers(accountId: string) {
    await this.profitRepository.delete({ filter: { accountId } });
  }

  async getActiveTiers(accountId: string) {
    return this.profitRepository.fetch(
      { accountId },
      {
        column: 'minAmount',
        direction: 'ASC',
      },
    );
  }

  async getTotalProfit(accountId: string) {}

  async calculateTransactionProfit(
    accountId: string,
    amount: number,
  ): Promise<number> {
    const tiers = await this.getActiveTiers(accountId);
    if (!tiers || !tiers.length) {
      return 0;
    }
    const highestTier = R.last<ProfitTier>(tiers);

    if (highestTier && amount < highestTier.minAmount) {
      return this.findProfitInTiers(amount, tiers);
    }
    console.log(tiers);

    return this.calculateCumulativeProfit(
      amount,
      tiers.map((tier) => ({
        ...tier,
        minAmount: Number(tier.minAmount),
        maxAmount: Number(tier.maxAmount),
        profit: Number(tier.profit),
      })),
    );
  }

  private findProfitInTiers(amount: number, tiers: ProfitTier[]): number {
    return (
      tiers.find((tier) => amount >= tier.minAmount && amount <= tier.maxAmount)
        ?.profit || 0
    );
  }

  private async calculateCumulativeProfit(
    amount: number,
    tiers: ProfitTier[],
  ): Promise<number> {
    let remainingAmount = amount;
    let totalProfit = 0;
    const highestTier = R.last<ProfitTier>(tiers);
    let maxTierAmount = Infinity;

    if (highestTier && highestTier.maxAmount) {
      maxTierAmount = Number(highestTier.maxAmount);

      while (remainingAmount > maxTierAmount) {
        totalProfit += Number(highestTier.profit);
        remainingAmount -= maxTierAmount;
      }

      totalProfit += this.findProfitInTiers(remainingAmount, tiers);
    }

    return totalProfit;
  }
}
