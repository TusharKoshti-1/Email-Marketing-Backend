import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateDomainDto {
  name: string;
}

class UpdateDomainDto {
  name: string;
}

@Controller('domains')
@UseGuards(JwtAuthGuard)
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.domainsService.findAll(req.user.userId);
  }

  @Post()
  async create(@Body() createDomainDto: CreateDomainDto, @Request() req: any) {
    return this.domainsService.create(req.user.userId, createDomainDto.name);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDomainDto: UpdateDomainDto,
    @Request() req: any,
  ) {
    return this.domainsService.update(+id, req.user.userId, updateDomainDto.name);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.domainsService.delete(+id, req.user.userId);
  }

  @Patch(':id/verify')
  async toggleVerify(@Param('id') id: string, @Request() req: any) {
    return this.domainsService.toggleVerify(+id, req.user.userId);
  }
}