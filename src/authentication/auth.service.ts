import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (user == null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, username: user.email };

    // Genera el token con jwtService.sign
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    return {
      access_token: token,
      expires_in: 3600, // Tiempo de expiración en segundos
    };
  }

  validateToken(token: string): any {
    try {
      // Valida el token con jwtService.verify
      const decodedToken = this.jwtService.verify(token);

      // Aquí puedes devolver la información que necesitas del token
      return {
        id: decodedToken.sub,
        email: decodedToken.username,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
