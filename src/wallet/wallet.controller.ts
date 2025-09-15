import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotFoundError } from 'rxjs';
import { AuthRequest, CreateWalletRequest } from '../libs/types';
import { WalletService } from './wallet.service';

@UseGuards(AuthGuard('jwt'))
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create-gcash-wallet')
  createGcashWallet(
    @Request() req: AuthRequest,
    @Body() body: CreateWalletRequest,
  ) {
    if (!body.balance || body.balance < 0) {
      body.balance = 0;
    }

    if (!req.user) {
      throw new NotFoundError('User not found');
    }
    return this.walletService.createGcashWallet(body.balance, req.user.userId);
  }

  @Post('create-cash-wallet')
  createCashWallet(
    @Request() req: AuthRequest,
    @Body() body: CreateWalletRequest,
  ) {
    if (!body.balance || body.balance < 0) {
      body.balance = 0;
    }

    if (!req.user) {
      throw new NotFoundError('User not found');
    }
    return this.walletService.createCashWallet(body.balance, req.user.userId);
  }
}
