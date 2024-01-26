import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreRiskService } from './score-risk.service';
import { Points } from './entities/points.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Points]),
    forwardRef(() => ScoreRiskModule),
  ],
  providers: [ScoreRiskService],
  exports: [ScoreRiskService],
})
export class ScoreRiskModule {}
