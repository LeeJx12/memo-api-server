import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, IsString } from "class-validator";
import { Document, Types } from "mongoose";

@Schema({
    timestamps: true,
    id: false,
    collection: 'comment'
})
export class Comment extends Document {
    @Prop({ required: true, unique: true, type: Types.ObjectId })
    @IsString()
    @IsNotEmpty()
    commentId: Types.ObjectId;

    @Prop()
    @IsString()
    @IsNotEmpty()
    memoId: string;

    @Prop()
    @IsString()
    @IsNotEmpty()
    userId: string;

    @Prop()
    @IsString()
    @IsNotEmpty()
    comment: string;

    @Prop()
    @IsString()
    writerName: string;
}

export class CommentDTO {
    commentId: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    memoId: string;

    userId: string;

    @IsString()
    @IsNotEmpty()
    comment: string;

    writerName: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);