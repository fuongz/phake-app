import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Config } from '@prisma/client';
import { PrismaService } from 'src/core/services/prisma.service';

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  async findByName(name: string): Promise<Config | null> {
    return this.prisma.config.findFirstOrThrow({
      where: {
        name: name,
        status: '1',
      },
    });
  }

  async updateById(id: string, data: any): Promise<Config | any> {
    const { description } = data;
    if (!id) throw new NotFoundException({ id });
    if (!description) throw new UnprocessableEntityException();
    return this.prisma.config.update({
      where: {
        id: parseInt(id),
      },
      data: {
        description,
      },
    });
  }
}
