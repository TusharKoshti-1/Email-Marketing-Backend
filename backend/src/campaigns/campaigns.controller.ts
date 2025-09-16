import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const userId = req.user.userId;
    return this.campaignsService.create({ ...body, user: { id: userId } } as any);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.campaignsService.findAll();
  }
}
