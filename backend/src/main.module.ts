import { Module } from '@nestjs/common';
import { AppConfigModule } from './config';
import { AppModules } from './app';

@Module({
  imports: [AppConfigModule, ...AppModules],
})
export class MainModule {}
