import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TrainingService } from '../training.service';
import { TrainingModule } from '../training.module';
import { handleError } from 'shared/utils/handleError';
import { UserService } from 'apps/users/src/users.service';

export const getTrainings = async (event: any) => {
  try {
    const app = await NestFactory.create(TrainingModule);
    const trainingService = app.get(TrainingService);
    const userService = app.get(UserService);
    const jwtService = app.get(JwtService);

    const token = event.headers.Authorization.split(' ')[1];

    const decodedToken = jwtService.verify(token, {
      secret: 'my_jwt_secret_key_1',
    });

    if (!decodedToken) {
      throw new Error('Invalid token');
    }
    const { userType, username } = decodedToken;

    const user = await userService.getUser(username);
    if (userType == 'trainer') {
      const trainer = await userService.getTrainer(user.id);
      const trainings = await trainingService.getAllTrainingsByTrainerId(
        trainer.id,
      );
      return {
        statusCode: 200,
        body: JSON.stringify(trainings),
      };
    } else {
      const student = await userService.getStudent(user.id);
      const trainings = await trainingService.getAllTrainingsByStudentId(
        student.id,
      );
      console.log(trainings, student);
      return {
        statusCode: 200,
        body: JSON.stringify(trainings),
      };
    }
  } catch (error) {
    return handleError(error);
  }
};
