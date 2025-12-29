import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
    @Prop({ required: true })
    title: string;

    @Prop()
    desc: string;

    @Prop({ required: true })
    deadline: string;

    @Prop({ default: 'Not Started' })
    status: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
