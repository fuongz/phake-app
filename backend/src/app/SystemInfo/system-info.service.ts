import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemInfoService {
  public getInfo() {
    return {
      database: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        name: process.env.DATABASE_NAME,
      },
    };
  }
}
