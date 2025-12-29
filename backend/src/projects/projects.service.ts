import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
    constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) { }

    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        const createdProject = new this.projectModel(createProjectDto);
        return createdProject.save();
    }

    async findAll(): Promise<Project[]> {
        return this.projectModel.find().exec();
    }

    async update(id: string, updateProjectDto: any): Promise<Project | null> {
        return this.projectModel.findByIdAndUpdate(id, updateProjectDto, { new: true });
    }

    async remove(id: string): Promise<Project | null> {
        return this.projectModel.findByIdAndDelete(id);
    }
}
