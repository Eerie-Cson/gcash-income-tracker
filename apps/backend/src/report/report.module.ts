import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ReportRepository } from './repository/report.repository';
import { Token } from './repository/token';

@Module({
  controllers: [ReportController],
  providers: [
    ReportService,
    { provide: Token.ReportRepository, useClass: ReportRepository },
  ],
  exports: [ReportService],
})
export class ReportModule {}
