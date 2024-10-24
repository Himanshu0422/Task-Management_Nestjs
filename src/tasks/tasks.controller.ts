import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    async create(@Body() createTaskDto: CreateTaskDto, @Request() req: any) {
        const userId = req.user.id;
        return await this.tasksService.create(createTaskDto, userId);
    }

    @Get()
    async findAll(@Request() req: any) {
        const userId = req.user.id;
        return await this.tasksService.findAll(userId);
    }

    @Get(':id')
    async find(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        const userId = req.user.id;
        return await this.tasksService.find(id, userId);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTaskDto: UpdateTaskDto,
        @Request() req: any
    ) {
        const userId = req.user.id;
        return await this.tasksService.update(id, updateTaskDto, userId);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        const userId = req.user.id;
        return await this.tasksService.remove(id, userId);
    }
}
