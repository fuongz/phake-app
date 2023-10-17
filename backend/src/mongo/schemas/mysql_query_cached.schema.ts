import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MySQLQueryCachedDocument = HydratedDocument<MySQLQueryCached>;

@Schema({
  collection: 'mysql_query_cached',
})
export class MySQLQueryCached {
  @Prop()
  host: string;

  @Prop()
  user: string;

  @Prop()
  database_name: string;

  @Prop()
  type: string;

  @Prop()
  rawQuery: string;

  @Prop({
    type: Boolean,
  })
  status: boolean;

  @Prop()
  trace: string;

  @Prop({
    type: Array,
  })
  parameters: Array<string>;

  @Prop({
    default: Date.now(),
  })
  created_at: Date;

  @Prop({
    default: Date.now(),
  })
  updated_at: Date;
}

export const MySQLQueryCachedSchema =
  SchemaFactory.createForClass(MySQLQueryCached);
