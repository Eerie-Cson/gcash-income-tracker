import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { WalletService } from 'src/wallet/wallet.service';
import {
  CreateTransactionRequest,
  TransactionType,
  WalletType,
} from '../libs/types';
import { Token as TranasctionToken } from './repository/token';
import { TransactionRepository } from './repository/transaction.repository';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(TranasctionToken.TransactionRepository)
    private readonly transactionsRepository: TransactionRepository,
    private walletService: WalletService,
    private accountService: AccountService,
  ) {}

  generateTransactionCode(date: number): string {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestampPart = date.toString(36).toUpperCase();
    return `TXN-${randomPart}-${timestampPart}`;
  }

  async getTransactions(accountId: string) {
    return this.transactionsRepository.fetch(
      {
        accountId,
      },

      {
        column: 'transactionDate',
        direction: 'DESC',
      },
    );
  }

  async getPaginatedTransactions(params: {
    id: string;
    options: {
      page: number;
      pageSize: number;
      searchTerm?: string;
      filterType?: string;
      orderBy?: string;
      orderDirection?: 'ASC' | 'DESC';
    };
  }) {
    const { id, options } = params;

    // Build the base filter
    const baseFilter: any = { accountId: id };

    if (options.filterType) {
      baseFilter.transactionType = options.filterType;
    }

    // Prepare repository options
    const repoOptions: any = {
      pagination: {
        page: options.page,
        limit: options.pageSize,
      },
    };

    if (options.orderBy) {
      repoOptions.orderBy = {
        column: options.orderBy as any,
        direction: options.orderDirection || 'DESC',
      };
    }

    // Use the enhanced repository with search support
    return this.transactionsRepository.paginate(
      baseFilter,
      repoOptions,
      options.searchTerm
        ? {
            term: options.searchTerm,
            fields: [
              'customerName',
              'referenceNumber',
              'customerPhone',
            ] as any[],
          }
        : undefined,
    );
  }

  async transfer(
    params: CreateTransactionRequest & {
      from: WalletType;
      to: WalletType;
      amount: number;
      transactionType: TransactionType;
      accountId: string;
    },
  ) {
    params.transactionDate = new Date(params.transactionDate);

    return this.transactionsRepository.executeTransactions(async (client) => {
      const fromWallet = await this.walletService.findWalletForUpdate(
        client,
        params.accountId,
        params.from,
      );

      const toWallet = await this.walletService.findWalletForUpdate(
        client,
        params.accountId,
        params.to,
      );

      if (!fromWallet || !toWallet) {
        throw new NotFoundException('Wallet not found');
      }

      if (fromWallet.balance < params.amount) {
        throw new BadRequestException(
          `Insufficient balance in ${params.from} wallet`,
        );
      }

      const newFromBalance = Number(fromWallet.balance) - params.amount;
      const newToBalance = Number(toWallet.balance) + params.amount;

      await this.walletService.updateBalance(
        client,
        fromWallet.id,
        newFromBalance,
      );

      await this.walletService.updateBalance(client, toWallet.id, newToBalance);

      const transactionDetails = {
        description: params.description || undefined,
        amount: params.amount || 0,
        transactionType: params.transactionType,
        referenceNumber: params.referenceNumber || undefined,
        transactionDate: params.transactionDate || undefined,
        transactionCode: this.generateTransactionCode(Date.now()),
        createdAt: new Date(),
        updatedAt: new Date(),
        accountId: params.accountId,
        customerName: params.customerName,
        customerPhone: params.customerPhone,
      };
      await this.transactionsRepository.createTransaction(
        client,
        transactionDetails,
      );

      return {
        [params.from]: newFromBalance,
        [params.to]: newToBalance,
        to: params.to,
        from: params.from,
        type: params.transactionType,
        data: transactionDetails,
      };
    });
  }

  async cashIn(params: {
    amount: number;
    description?: string;
    referenceNumber?: string;
    transactionDate: Date;
    accountId: string;
  }) {
    const account = await this.accountService.findById(params.accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.transfer({
      ...params,
      from: WalletType.GCASH,
      to: WalletType.CASH,
      transactionType: TransactionType.CASH_IN,
      accountId: account.id,
    });
  }

  async cashOut(params: {
    amount: number;
    description?: string;
    referenceNumber?: string;
    transactionDate: Date;
    accountId: string;
  }) {
    const account = await this.accountService.findById(params.accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return this.transfer({
      ...params,
      from: WalletType.CASH,
      to: WalletType.GCASH,
      transactionType: TransactionType.CASH_OUT,
      accountId: account.id,
    });
  }
}
