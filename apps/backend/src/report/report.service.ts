import { Inject, Injectable } from '@nestjs/common';
import {
  ProfitSummary,
  ReportRepository,
} from './repository/report.repository';
import { Token } from './repository/token';

@Injectable()
export class ReportService {
  constructor(
    @Inject(Token.ReportRepository)
    private readonly reportRepository: ReportRepository,
  ) {}

  async getProfitSummary(accountId: string): Promise<ProfitSummary> {
    return this.reportRepository.getProfitSummary(accountId);
  }
}
