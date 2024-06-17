import { IsString, IsOptional } from 'class-validator';

export class UpdateStudentDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
