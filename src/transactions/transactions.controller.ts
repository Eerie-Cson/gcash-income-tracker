import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest, CreateTransactionRequest } from '../libs/types';
import { TransactionsService } from './transactions.service';

@UseGuards(AuthGuard('jwt'))
@Controller('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('cash-in')
  cashIn(@Request() req: AuthRequest, @Body() body: CreateTransactionRequest) {
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
  cashOut(@Request() req: AuthRequest, @Body() body: CreateTransactionRequest) {
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
