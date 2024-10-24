import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        try {
            return await this.authService.register(createUserDto);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new ConflictException(
                'Could not register user. Please check your email and username.',
            );
        }
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        const token = await this.authService.login(loginUserDto);
        return { access_token: token.access_token };
    }
}
