import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

@Injectable()
export class UsersService {

    private users = [
        { id: 1, username: 'john_doe', email: 'john@example.com', password: 'secret' },
        { id: 2, username: 'jane_doe', email: 'jane@example.com', password: 'secret' },
    ];

    findAll() {
        return this.users;
    }

    find(id: number) {
        const user = this.users.find((user) => user.id === id);
        if (!user) {
            throw new NotFoundException('User not found.');
        }
        return user;
    }

    create(userData: CreateUserDto) {
        const newUser = {
            id: this.users.length + 1,
            ...userData,
        };
        this.users.push(newUser);
        return newUser;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        this.users = this.users.map((user) => {
            if (user.id === id) {
                return { ...user, ...updateUserDto };
            }
            return user;
        });

        return this.find(id);
    }

    remove(id: number) {
        const removedUser = this.find(id);
        this.users = this.users.filter((user) => user.id !== id);
        return removedUser;
    }
}
