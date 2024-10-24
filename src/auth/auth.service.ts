import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) { }

    async register(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        try {
            const user = await this.usersService.create({
                ...createUserDto,
                password: hashedPassword,
            });
            return { id: user.id, username: user.username, email: user.email };
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Username or email already exists.');
            }
            throw new InternalServerErrorException('Failed to register user.');
        }
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.validateUser(loginUserDto.username, loginUserDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.username, id: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
