import { Injectable } from '@nestjs/common';
import { DynamoDBService } from './dynamodb.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateTraierDto } from './dto/create-trainer.dto';
import { Student, Trainer, User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Specialization } from './specialization.entity';
@Injectable()
export class UserService {
  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const user: User = { ...createUserDto };
    await this.dynamoDBService.register(user);
    return user;
  }
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.dynamoDBService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async getUser(username: string): Promise<User | null> {
    const user = await this.dynamoDBService.findByUsername(username);

    if (user) {
      return user;
    }
    return null;
  }
  async getUsersByFirstname(firstName: string): Promise<User[] | null> {
    const users = await this.dynamoDBService.findUsersByFirstname(firstName);

    if (users) {
      return users;
    }
    return null;
  }
  async getSpecialization(id: string): Promise<Specialization | null> {
    const specialization =
      await this.dynamoDBService.findSpecializationById(id);
    if (specialization) {
      return specialization;
    }
    return null;
  }
  async getAllSpecializations(): Promise<Specialization[] | null> {
    const specialization = await this.dynamoDBService.findAllSpecializations();
    if (specialization) {
      return specialization;
    }
    return null;
  }

  async deleteUserById(id: string): Promise<void> {
    return await this.dynamoDBService.deleteUserById(id);
  }
  async updateUserPhoto(username: string, photoUrl: string): Promise<void> {
    return await this.dynamoDBService.updateUserPhoto(username, photoUrl);
  }
  async updatePassword(username: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.dynamoDBService.updatePassword(username, hashedPassword);
  }
  async comparePasswords(
    providedPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(providedPassword, storedPassword);
  }
  async addStudent(student: CreateStudentDto): Promise<Student> {
    await this.dynamoDBService.addStudent(student);
    return student;
  }

  async addTrainer(trainer: CreateTraierDto): Promise<Trainer> {
    await this.dynamoDBService.addTrainer(trainer);
    return trainer;
  }

  async getTrainer(userId: string): Promise<Trainer> {
    const trainer = await this.dynamoDBService.getTrainerByUserId(userId);
    return trainer;
  }
  async getStudent(userId: string): Promise<Student> {
    const student = await this.dynamoDBService.getStudentByUserId(userId);
    return student;
  }
}
