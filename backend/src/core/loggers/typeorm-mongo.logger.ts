import { Logger as TypeOrmLogger } from 'typeorm';
import { Logger as NestLogger } from '@nestjs/common';
import { TypeOrmConfigService } from 'src/config/typeorm-config.service';

export class TypeOrmMongoLogger implements TypeOrmLogger {
  private readonly logger = new NestLogger('SQL');

  constructor(private readonly typeormConfigService: TypeOrmConfigService) {}

  logQuery(query: string, parameters?: unknown[]) {
    this.typeormConfigService.create({
      rawQuery: query,
      parameters: parameters ? parameters : [],
      type: this.getQueryType(query),
      trace: '',
      status: true,
    });
    this.logger.log(
      `${query} -- Parameters: ${this.stringifyParameters(parameters)}`,
    );
  }

  logQueryError(error: string, query: string, parameters?: unknown[]) {
    this.typeormConfigService.create({
      rawQuery: query,
      parameters: parameters ? parameters : [],
      type: this.getQueryType(query),
      trace: error,
      status: false,
    });
    this.logger.error(
      `${query} -- Parameters: ${this.stringifyParameters(
        parameters,
      )} -- ${error}`,
    );
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    this.typeormConfigService.create({
      rawQuery: query,
      parameters: parameters ? parameters : [],
      type: this.getQueryType(query),
      trace: 'SLOW',
      status: true,
    });
    this.logger.warn(
      `Time: ${time} -- Parameters: ${this.stringifyParameters(
        parameters,
      )} -- ${query}`,
    );
  }

  logMigration(message: string) {
    this.logger.log(message);
  }

  logSchemaBuild(message: string) {
    this.logger.log(message);
  }

  log(level: 'log' | 'info' | 'warn', message: string) {
    if (level === 'log') {
      return this.logger.log(message);
    }
    if (level === 'info') {
      return this.logger.debug(message);
    }
    if (level === 'warn') {
      return this.logger.warn(message);
    }
  }

  private getQueryType(query: string) {
    if (query.startsWith('SELECT') && !query.startsWith('SELECT VERSION()')) {
      return 'SELECT';
    }

    if (query.startsWith('INSERT INTO')) {
      return 'INSERT';
    }

    if (query.startsWith('UPDATE')) {
      return 'UPDATE';
    }

    return null;
  }

  private stringifyParameters(parameters?: unknown[]) {
    try {
      return JSON.stringify(parameters);
    } catch {
      return '';
    }
  }
}
