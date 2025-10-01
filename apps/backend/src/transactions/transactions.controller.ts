import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
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
  async getPaginatedTransactions(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('search') searchTerm: string,
    @Query('type') filterType: string,
    @Query('orderBy') orderBy: string = 'transactionDate',
    @Query('orderDirection') orderDirection: 'ASC' | 'DESC' = 'DESC',
    @Request() req: AuthRequest,
  ) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }

    return this.transactionsService.getPaginatedTransactions({
      id: req.user.userId,
      options: {
        page: Math.max(1, page),
        pageSize: Math.min(50, Math.max(1, pageSize)),
        searchTerm,
        filterType: filterType === 'all' ? undefined : filterType,
        orderBy,
        orderDirection,
      },
    });
  }
  @Get('list')
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
      // return this.transactionsService.transfer({
      //   ...body,
      //   to: WalletType.CASH,
      //   from: WalletType.GCASH,
      //   accountId: req.user.userId,
      // });
      return this.transactionsService.cashIn({
        ...body,
        accountId: req.user.userId,
      });
    }

    if (body?.transactionType === TransactionType.CASH_OUT) {
      // return this.transactionsService.transfer({
      //   ...body,
      //   to: WalletType.GCASH,
      //   from: WalletType.CASH,
      //   accountId: req.user.userId,
      // });
      return this.transactionsService.cashOut({
        ...body,
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

  // @Post('cash-in')
  // async cashIn(
  //   @Request() req: AuthRequest,
  //   @Body() body: CreateTransactionRequest,
  // ) {
  //   if (!req.user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   if (!body.amount || body.amount < 0) {
  //     body.amount = 0;
  //   }
  //   return this.transactionsService.cashIn({
  //     ...body,
  //     accountId: req.user.userId,
  //   });
  // }

  // @Post('cash-out')
  // async cashOut(
  //   @Request() req: AuthRequest,
  //   @Body() body: CreateTransactionRequest,
  // ) {
  //   if (!req.user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   if (!body.amount || body.amount < 0) {
  //     body.amount = 0;
  //   }

  //   return this.transactionsService.cashOut({
  //     ...body,
  //     transactionType: TransactionType.CASH_OUT,
  //     accountId: req.user.userId,
  //     separateFee: body.separateFee,
  //   });
  // }
}
