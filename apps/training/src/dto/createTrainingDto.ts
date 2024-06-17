import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TrainingType } from '../training.entity';
import { Student, Trainer } from 'apps/users/src/user.entity';

export class CreateTrainingDto {
  @ValidateNested()
  @Type(() => Student)
  @IsNotEmpty()
  student: Student;

  @ValidateNested()
  @Type(() => Trainer)
  @IsNotEmpty()
  trainer: Trainer;

  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => TrainingType)
  type: TrainingType;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsOptional()
  description?: string;
}
