import {
  Controller,
  Get,
  NotFoundException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from '../libs/types';
import { ReportService } from './report.service';

@UseGuards(AuthGuard('jwt'))
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('profit-summary')
  async getProfitSummary(@Request() req: AuthRequest) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    return this.reportService.getProfitSummary(req.user.userId);
  }

  @Get('dashboard-stats')
  async getDashboardStats(@Request() req: AuthRequest) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    return this.reportService.getDashboardStats(req.user.userId);
  }
}
