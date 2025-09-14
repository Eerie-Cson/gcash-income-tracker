import { Body, Controller, Post } from '@nestjs/common';
import { CreateWalletRequest } from '../libs/types';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(@Body() body: CreateWalletRequest) {
    return this.walletService.create(body);
  }
}
