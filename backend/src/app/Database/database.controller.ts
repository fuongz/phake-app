import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DatabaseService } from './database.service';
import { AuthGuard } from '../Auth/auth.guard';

@Controller('database')
export class DatabaseController {
  constructor(private databaseService: DatabaseService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getDatabaseConnection(
    @Request() req,
    @Query() query: { default: string },
  ) {
    const isDefault =
      typeof query.default !== 'undefined'
        ? query.default === 'true' || query.default === '1'
          ? true
          : false
        : null;
    return this.databaseService.findByUserId(req.user.sub, isDefault);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createDatabaseConnection(@Req() req) {
    return this.databaseService.create(req);
  }
}
