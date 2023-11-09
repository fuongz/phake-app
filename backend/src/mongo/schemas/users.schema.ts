import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'users',
})
export class User {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop({
    select: false,
  })
  password: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop({
    default: Date.now(),
  })
  last_signed_in: Date;

  @Prop({
    default: Date.now(),
  })
  created_at: Date;

  @Prop({
    default: Date.now(),
  })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
