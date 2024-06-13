import { TrainingModule } from '../training.module';
import { TrainingService } from '../training.service';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

export const searchTrainings = async (event: any) => {
  try {
    const app = await NestFactory.create(TrainingModule);
    const trainingService = app.get(TrainingService);
    const jwtService = app.get(JwtService);
    const searchData = JSON.parse(event.body);
    const token = event.headers.Authorization.split(' ')[1];
    const decodedToken = jwtService.decode(token);
    if (!decodedToken) {
      throw new Error('Invalid token');
    }
    const training = await trainingService.searchTrainings(searchData);
    return {
      statusCode: 200,
      body: JSON.stringify({ ...training }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    };
  }
};
