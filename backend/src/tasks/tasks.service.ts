import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        const createdTask = new this.taskModel(createTaskDto);
        return createdTask.save();
    }

    async findAll(): Promise<Task[]> {
        return this.taskModel.find().exec();
    }

    async update(id: string, updateTaskDto: any): Promise<Task | null> {
        return this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true });
    }

    async remove(id: string): Promise<Task | null> {
        return this.taskModel.findByIdAndDelete(id);
    }
}
