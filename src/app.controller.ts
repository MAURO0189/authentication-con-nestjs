import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './authentication/auth.service';
import { JwtAuthGuard } from './authentication/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Request() req): Promise<any> {
    try {
      console.log('req.user:', req.user);
      const email = (req.user && req.user.email) || null;

      if (!email) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const user = await this.authService.validateUser(email);
      return this.authService.login(user);
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:email')
  async getUser(@Param('email') email: string) {
    try {
      const user = await this.authService.validateUser(email);
      return user;
    } catch (e) {
      console.log(e.message);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND, // se cambia esta línea para manejar email que no existen
          error: e.message,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: e.message,
        },
      );
    }
  }
}
