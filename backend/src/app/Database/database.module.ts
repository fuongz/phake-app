import { Module } from '@nestjs/common';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MySQLConfig,
  MySQLConfigSchema,
} from 'src/mongo/schemas/mysql_config.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService) {
        return {
          secret: configService.get('JWT_SECRET_KEY', ''),
          global: true,
          signOptions: {
            expiresIn: '7 days',
          },
        };
      },
    }),
    MongooseModule.forFeature([
      { name: MySQLConfig.name, schema: MySQLConfigSchema },
    ]),
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService],
})
export class DatabaseModule {}
