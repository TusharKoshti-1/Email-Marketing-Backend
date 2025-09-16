import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from './campaign.entity';

@Injectable()
export class CampaignsService {
  constructor(@InjectRepository(Campaign) private repo: Repository<Campaign>) {}

  create(data: Partial<Campaign>) {
    const campaign = this.repo.create(data);
    return this.repo.save(campaign);
  }

  findAll() {
    return this.repo.find({ relations: ['user'] });
  }
}
