import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, IsString } from "class-validator";
import { Document, Types } from "mongoose";

@Schema({
    timestamps: true,
    id: false,
    collection: 'memo'
})
export class Memo extends Document {
    @Prop({ required: true, unique: true, type: Types.ObjectId })
    @IsString()
    @IsNotEmpty()
    memoId: Types.ObjectId;

    @Prop()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Prop()
    @IsString()
    @IsNotEmpty()
    memo: string;

    @Prop()
    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class MemoDTO {
    @IsString()
    @IsNotEmpty()
    memoId: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    memo: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
}

export const MemoSchema = SchemaFactory.createForClass(Memo);