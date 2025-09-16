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
import { AuthRequest, CreateWalletRequest, WalletType } from '../libs/types';
import { WalletService } from './wallet.service';

@UseGuards(AuthGuard('jwt'))
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async getWallets(@Request() req: AuthRequest) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    return this.walletService.findWallets(req.user.userId);
  }

  @Get('Balances')
  async getBalances(@Request() req: AuthRequest) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    return this.walletService.getBalances(req.user.userId);
  }

  @Get('gcash')
  async getGcashWallet(@Request() req: AuthRequest) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    return this.walletService.findWallet(req.user.userId, WalletType.GCASH);
  }

  @Post('create-gcash-wallet')
  async createGcashWallet(
    @Request() req: AuthRequest,
    @Body() body: CreateWalletRequest,
  ) {
    if (!body.balance || body.balance < 0) {
      body.balance = 0;
    }

    if (!req.user) {
      throw new NotFoundException('User not found');
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
      throw new NotFoundException('User not found');
    }
    return this.walletService.createCashWallet(body.balance, req.user.userId);
  }
}
