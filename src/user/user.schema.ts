import { IsString, IsNotEmpty } from 'class-validator';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  id: false,
  collection: 'user'
})
export class User extends Document {
  @Prop({ required: true, unique: true, type: Types.ObjectId })
  @IsString()
  @IsNotEmpty()
  userId: Types.ObjectId;

  @Prop()
  @IsString()
  @IsNotEmpty()
  loginId: string;

  @Prop()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop()
  @IsString()
  @IsNotEmpty()
  userName: string;
}

export class UserDTO {
  userId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  loginId: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  userName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
