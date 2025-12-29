import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
    @Prop({ required: true })
    name: string;

    @Prop({ type: [], default: [] })
    folders: any[]; // Flexible structure for nested folders

    @Prop({ type: [], default: [] })
    documents: any[]; // Flexible structure for documents

    @Prop({ default: () => new Date().toLocaleDateString() })
    createdAt: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
