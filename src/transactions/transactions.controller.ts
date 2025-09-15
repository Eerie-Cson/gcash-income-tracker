import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransactionRequest } from '../libs/types';
import { TransactionsService } from './transactions.service';

@Controller('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('cash-in')
  cashIn(@Body() body: CreateTransactionRequest) {
    return this.transactionsService.cashIn(body);
  }

  @Post('cash-out')
  cashOut(@Body() body: CreateTransactionRequest) {
    return this.transactionsService.cashOut(body);
  }
}
