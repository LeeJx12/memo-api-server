import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema({
  timestamps: true,
  id: false,
  collection: 'user'
})
export class User extends Document {
  @Prop({ required: true, unique: true, type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop()
  loginId: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
