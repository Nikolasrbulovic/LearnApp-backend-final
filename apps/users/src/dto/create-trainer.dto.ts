import { IsString, IsOptional,  } from 'class-validator';

export class CreateTraierDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  specializationId:string;
}
