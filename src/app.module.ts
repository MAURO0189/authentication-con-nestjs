import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
<<<<<<< HEAD
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
=======
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AuthModule } from './authentication/auth.module';
import { MyConfigModule } from './config.module';
import { Points } from './scorePoint/entities/points.entity';
import { ScoreRiskModule } from './scorePoint/score-risk.module';
>>>>>>> 547c72267f7da135033b6cdf37183b78d0774f41

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'users',
<<<<<<< HEAD
      entities: [User],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
=======
      entities: [User, Points],
      synchronize: true,
    }),
    MyConfigModule,
    AuthModule,
    ScoreRiskModule,
  ],
  controllers: [AppController],
>>>>>>> 547c72267f7da135033b6cdf37183b78d0774f41
})
export class AppModule {}
