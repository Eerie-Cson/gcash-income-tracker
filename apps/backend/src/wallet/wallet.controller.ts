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
  CreateWalletRequest,
  UpdateWalletRequest,
  WalletType,
} from '../libs/types';
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

  @Post('adjustment')
  async walletAdjustment(
    @Request() req: AuthRequest,
    @Body() body: UpdateWalletRequest,
  ) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }

    if (!body.balance || body.balance < 0) {
      return {
        body,
        error: 'Balance cannot be negative',
        statusCode: 400,
        message: 'Balance cannot be negative',
      };
    }
    if ((body.type as WalletType) === WalletType.CASH)
      return this.walletService.updateCashBalance(
        req.user.userId,
        body.balance,
      );

    if ((body.type as WalletType) === WalletType.GCASH)
      return this.walletService.updateGcashBalance(
        req.user.userId,
        body.balance,
      );
    //to be improved return structure
    return {
      body,
      error: 'Invalid transaction type',
      statusCode: 400,
      message: 'Invalid transaction type',
    };
  }
}
