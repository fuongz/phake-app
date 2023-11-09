import { Controller, Post, Req } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(private databaseService: DatabaseService) {}

  @Post()
  async createDatabaseConnection(@Req() req) {
    return this.databaseService.create(req);
  }
}
