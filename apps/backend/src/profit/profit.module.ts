import { Module } from '@nestjs/common';
import { ProfitService } from './profit.service';
import { ProfitController } from './profit.controller';
import { ProfitRepository } from './repository/profit.repository';
import { Token } from './repository/token';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [AccountModule],
  controllers: [ProfitController],
  providers: [
    { provide: Token.ProfitRepository, useClass: ProfitRepository },
    ProfitService,
  ],
})
export class ProfitModule {}
