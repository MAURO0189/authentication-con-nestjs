import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AuthModule } from './authentication/auth.module';
import { MyConfigModule } from './config.module';
import { Points } from './scorePoint/entities/points.entity';
import { ScoreRiskModule } from './scorePoint/score-risk.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'users',
      entities: [User, Points],
      synchronize: true,
    }),
    MyConfigModule,
    AuthModule,
    ScoreRiskModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
