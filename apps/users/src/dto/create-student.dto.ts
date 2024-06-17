import { IsString, IsOptional } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  fullName: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
