import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  photo?: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  role: string;
}
