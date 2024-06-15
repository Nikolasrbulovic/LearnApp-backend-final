import { handleError } from 'shared/utils/handleError';
import { TrainingModule } from '../training.module';
import { TrainingService } from '../training.service';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

export const postTraining = async (event: any) => {
  try {
    const app = await NestFactory.create(TrainingModule);
    const trainingService = app.get(TrainingService);
    const jwtService = app.get(JwtService);
    const trainingData = JSON.parse(event.body);

    const token = event.headers.Authorization.split(' ')[1];

    const decodedToken = jwtService.verify(token, {
      secret: 'my_jwt_secret_key_1',
    });

    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    const training = await trainingService.postTraining(trainingData);
    return {
      statusCode: 200,
      body: JSON.stringify({ ...training }),
    };
  } catch (error) {
    return handleError(error);
  }
};
