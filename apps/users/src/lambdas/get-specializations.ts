import { NestFactory } from '@nestjs/core';
import { UsersModule } from '../users.module';
import { UserService } from '../users.service';
import { handleError } from 'shared/utils/handleError';

export const getSpecializations = async (event: any) => {
  try {
    const app = await NestFactory.create(UsersModule);
    const userService = app.get(UserService);

    const specializations = await userService.getAllSpecializations();
    if (specializations) {
      return {
        statusCode: 200,
        body: JSON.stringify(specializations),
      };
    }
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};
