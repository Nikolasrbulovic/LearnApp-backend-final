import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TrainingService } from '../training.service';
import { TrainingModule } from '../training.module';


export const getTrainings = async (event: any) => {
  try {
    const app = await NestFactory.create(TrainingModule);
    const trainingService = app.get(TrainingService);
    const jwtService = app.get(JwtService);

    const token = event.headers.Authorization.split(' ')[1];
    const decodedToken = jwtService.decode(token);
    if (!decodedToken) {
      throw new Error('Invalid token');
    }
    
    
    const trainingsData = await trainingService.getAllTrainings()

    return {
      statusCode: 200,
      body: JSON.stringify({...trainingsData}),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }

}