import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createTaskDto: CreateTaskDto, userId: number) {
        return await this.prisma.task.create({
            data: {
                ...createTaskDto,
                userId,
            },
        });
    }

    async findAll(userId: number) {
        return await this.prisma.task.findMany({
            where: { userId },
        });
    }

    async find(id: number, userId: number) {
        const task = await this.prisma.task.findFirst({
            where: { id, userId },
        });
        if (!task) {
            throw new NotFoundException('Task not found.');
        }
        return task;
    }

    async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
        const task = await this.find(id, userId);
        return await this.prisma.task.update({
            where: { id: task.id },
            data: updateTaskDto,
        });
    }

    async remove(id: number, userId: number) {
        const task = await this.find(id, userId);
        return await this.prisma.task.delete({
            where: { id: task.id },
        });
    }
}
