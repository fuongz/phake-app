import { ConfigModule } from './Config/config.module';
import { DatabaseModule } from './Database/database.module';
import { SystemInfoModule } from './SystemInfo/system-info.module';

export const AppModules = [ConfigModule, DatabaseModule, SystemInfoModule];
