import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TrainingService } from '../training.service';
import { TrainingModule } from '../training.module';
import { handleError } from 'shared/utils/handleError';

export const getTrainingTypes = async (event: any) => {
  try {
    const app = await NestFactory.create(TrainingModule);
    const trainingService = app.get(TrainingService);
    const jwtService = app.get(JwtService);

    const token = event.headers.Authorization.split(' ')[1];

    const decodedToken = jwtService.verify(token, {
      secret: 'my_jwt_secret_key_1',
    });

    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    const trainingTypesData = await trainingService.getAllTrainingTypes();

    return {
      statusCode: 200,
      body: JSON.stringify({ ...trainingTypesData }),
    };
  } catch (error) {
    return handleError(error);
  }
};
