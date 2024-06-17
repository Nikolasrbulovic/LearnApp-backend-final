import { handleError } from 'shared/utils/handleError';
import { TrainingModule } from '../training.module';
import { TrainingService } from '../training.service';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'apps/users/src/users.service';
import { generateUniqueID } from 'shared/utils/generateId';

export const postTraining = async (event: any) => {
  try {
    const app = await NestFactory.create(TrainingModule);
    const trainingService = app.get(TrainingService);
    const jwtService = app.get(JwtService);
    const userService = app.get(UserService);
    const { trainerId, ...trainingData } = JSON.parse(event.body);

    const token = event.headers.Authorization.split(' ')[1];

    const decodedToken = jwtService.verify(token, {
      secret: 'my_jwt_secret_key_1',
    });

    if (!decodedToken) {
      throw new Error('Invalid token');
    }
    const { userId } = decodedToken;
    const student = await userService.getStudent(userId);
    const training = { student, ...trainingData, id: generateUniqueID() };
    const result = await trainingService.addTraining(training);

    return {
      statusCode: 200,
      body: JSON.stringify({ ...result }),
    };
  } catch (error) {
    return handleError(error);
  }
};
