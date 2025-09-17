import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Domain } from "./domain.entity";

@Injectable()
export class DomainsService {
  constructor(
    @InjectRepository(Domain)
    private domainsRepository: Repository<Domain>
  ) {}

  async findAll(userId: number): Promise<Domain[]> {
    return this.domainsRepository.find({
      where: { userId },
      order: { id: "ASC" },
    });
  }

  async create(userId: number, name: string): Promise<Domain> {
    const domain = this.domainsRepository.create({
      name: name.trim().toLowerCase(),
      verified: false,
      userId,
    });
    return this.domainsRepository.save(domain);
  }

  async update(id: number, userId: number, name: string): Promise<Domain> {
    const domain = await this.findOneByUser(id, userId);
    domain.name = name.trim().toLowerCase();
    return this.domainsRepository.save(domain);
  }

  async delete(id: number, userId: number): Promise<void> {
    const result = await this.domainsRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException("Domain not found");
    }
  }

  async toggleVerify(id: number, userId: number): Promise<Domain> {
    const domain = await this.findOneByUser(id, userId);
    domain.verified = !domain.verified;
    return this.domainsRepository.save(domain);
  }

  private async findOneByUser(id: number, userId: number): Promise<Domain> {
    const domain = await this.domainsRepository.findOne({
      where: { id, userId },
    });
    if (!domain) {
      throw new NotFoundException("Domain not found");
    }
    return domain;
  }
}
