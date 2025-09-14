import { Module } from '@nestjs/common';
import { Token } from './repository/token';
import { WalletRepository } from './repository/wallet.repository';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  controllers: [WalletController],
  providers: [
    { provide: Token.WalletRepository, useClass: WalletRepository },
    WalletService,
  ],
})
export class WalletModule {}
