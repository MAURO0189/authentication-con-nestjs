// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt'; // Importa el módulo JwtModule aquí
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importa el módulo ConfigModule
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService], // Inyecta el ConfigService
    }), // Configura JwtModule con la clave secreta
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
