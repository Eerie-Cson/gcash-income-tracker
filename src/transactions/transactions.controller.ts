import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransactionRequest } from '../libs/types';
import { TransactionsService } from './transactions.service';

@Controller('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() body: CreateTransactionRequest) {
    return this.transactionsService.create(body);
  }
}
