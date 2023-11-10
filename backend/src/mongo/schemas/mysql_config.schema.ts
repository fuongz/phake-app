import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'mysql_config',
})
export class MySQLConfig {
  @Prop()
  host: string;

  @Prop()
  user: string;

  @Prop({
    select: false,
  })
  password: string;

  @Prop()
  database_name: string;

  @Prop({ default: null })
  user_id: string;

  @Prop({
    default: false,
  })
  default: boolean;

  @Prop({
    default: Date.now(),
  })
  last_connected: Date;

  @Prop({
    default: Date.now(),
  })
  created_at: Date;

  @Prop({
    default: Date.now(),
  })
  updated_at: Date;
}

export const MySQLConfigSchema = SchemaFactory.createForClass(MySQLConfig);
