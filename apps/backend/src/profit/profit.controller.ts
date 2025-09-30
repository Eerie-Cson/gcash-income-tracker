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
import { AuthRequest, CreateTierRequest } from '../libs/types';
import { ProfitService } from './profit.service';

@UseGuards(AuthGuard('jwt'))
@Controller('profits')
export class ProfitController {
  constructor(private readonly profitService: ProfitService) {}
  @Post('fee-tiers')
  async saveFeeTiers(
    @Request() req: AuthRequest,
    @Body() body: { profitTiers: CreateTierRequest[] },
  ) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    if (!body.profitTiers || body.profitTiers.length === 0) {
      return this.profitService.deleteAllTiers(req.user.userId);
    }
    return this.profitService.saveProfitTiers(
      req.user.userId,
      body.profitTiers,
    );
  }

  @Get('fee-tiers')
  async getFeeTiers(@Request() req: AuthRequest) {
    if (!req.user) {
      throw new NotFoundException('User not found');
    }
    return this.profitService.getTiers(req.user.userId);
  }
}
