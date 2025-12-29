import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    subject: string;

    @Prop({ required: true })
    deadline: string;

    @Prop({ default: 'À faire' })
    status: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
