import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  AuthRequest,
  CreateTransactionRequest,
  TransactionType,
  WalletType,
} from '../libs/types';
import { TransactionsService } from './transactions.service';

@UseGuards(AuthGuard('jwt'))
@Controller('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(@Request() req: AuthRequest) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    return this.transactionsService.getTransactions(req.user.userId);
  }

  @Post()
  async transfer(
    @Request() req: AuthRequest,
    @Body() body: CreateTransactionRequest,
  ) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    if (!body.amount || body.amount < 0) {
      body.amount = 0;
    }
    if (body?.transactionType === TransactionType.CASH_IN) {
      return this.transactionsService.transfer({
        ...body,
        to: WalletType.CASH,
        from: WalletType.GCASH,
        accountId: req.user.userId,
      });
    }

    if (body?.transactionType === TransactionType.CASH_OUT) {
      return this.transactionsService.transfer({
        ...body,
        to: WalletType.GCASH,
        from: WalletType.CASH,
        accountId: req.user.userId,
      });
    }

    return {
      body,
      error: 'Invalid transaction type',
      statusCode: 400,
      message: 'Invalid transaction type',
    };
  }

  @Post('cash-in')
  async cashIn(
    @Request() req: AuthRequest,
    @Body() body: CreateTransactionRequest,
  ) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    if (!body.amount || body.amount < 0) {
      body.amount = 0;
    }
    return this.transactionsService.cashIn({
      ...body,
      accountId: req.user.userId,
    });
  }

  @Post('cash-out')
  async cashOut(
    @Request() req: AuthRequest,
    @Body() body: CreateTransactionRequest,
  ) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    if (!body.amount || body.amount < 0) {
      body.amount = 0;
    }
    return this.transactionsService.cashOut({
      ...body,
      accountId: req.user.userId,
    });
  }
}
