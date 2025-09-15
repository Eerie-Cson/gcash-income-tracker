import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { Token as WalletToken } from './repository/token';
import { WalletRepository } from './repository/wallet.repository';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [AccountModule],
  controllers: [WalletController],
  providers: [
    { provide: WalletToken.WalletRepository, useClass: WalletRepository },
    WalletService,
  ],
  exports: [WalletService],
})
export class WalletModule {}
