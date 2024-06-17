import { IsString } from 'class-validator';

export class CreateTraierDto {
  @IsString()
  trainerFullName: string;

  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  specializationId: string;
}
