import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmMongoLogger } from 'src/core/loggers/typeorm-mongo.logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: parseInt(configService.get('REDIS_PORT', '6379')),
        },
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URL', 'mongodb://localhost:27017/db'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: parseInt(configService.get('DATABASE_PORT', '3306')),
        username: configService.get('DATABASE_USER', 'root'),
        password: configService.get('DATABASE_PASS', ''),
        database: configService.get('DATABASE_NAME', 'database_name'),
        entities: [__dirname + '/models/*.entity{.ts,.js}'],
        synchronize: false,
        logger: new TypeOrmMongoLogger(),
      }),
    }),
  ],
})
export class AppConfigModule {}
