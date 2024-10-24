import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        try {
            return await this.prisma.user.findMany();
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve users.');
        }
    }

    async find(id: number) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) {
                throw new NotFoundException('User not found.');
            }
            return user;
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve user.');
        }
    }

    async create(userData: CreateUserDto) {
        try {
            return await this.prisma.user.create({ data: userData });
        } catch (error) {
            throw new InternalServerErrorException('Failed to create user.');
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: updateUserDto,
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('User not found.');
            }
            throw new InternalServerErrorException('Failed to update user.');
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.user.delete({ where: { id } });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('User not found.');
            }
            throw new InternalServerErrorException('Failed to delete user.');
        }
    }
}
