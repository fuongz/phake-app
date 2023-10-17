import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConfigCachedDocument = HydratedDocument<ConfigCached>;

@Schema({
  collection: 'config_cached',
})
export class ConfigCached {
  @Prop()
  host: string;

  @Prop()
  user: string;

  @Prop()
  database: string;

  @Prop()
  original: string;

  @Prop()
  modified: string;

  @Prop({
    default: Date.now(),
  })
  created_at: Date;

  @Prop({
    default: Date.now(),
  })
  updated_at: Date;
}

export const ConfigCachedSchema = SchemaFactory.createForClass(ConfigCached);
