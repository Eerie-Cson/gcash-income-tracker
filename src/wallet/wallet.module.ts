import { Module } from '@nestjs/common';
import { AccountRepository } from '../account/repository/account.repository';
import { Token as AccountToken } from '../account/repository/token';
import { Token as WalletToken } from './repository/token';
import { WalletRepository } from './repository/wallet.repository';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  controllers: [WalletController],
  providers: [
    {
      provide: AccountToken.AccountRepository,
      useClass: AccountRepository,
    },
    { provide: WalletToken.WalletRepository, useClass: WalletRepository },
    WalletService,
  ],
})
export class WalletModule {}
