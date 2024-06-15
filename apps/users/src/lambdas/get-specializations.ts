import { NestFactory } from '@nestjs/core';
import { UsersModule } from '../users.module';
import { UserService } from '../users.service';
import { JwtService } from '@nestjs/jwt';
import { handleError } from 'shared/utils/handleError';

export const getSpecializations = async (event: any) => {
  try {
    const app = await NestFactory.create(UsersModule);
    const userService = app.get(UserService);
    const jwtService = app.get(JwtService);
    const token = event.headers.Authorization.split(' ')[1];

    const decodedToken = jwtService.verify(token, {
      secret: 'my_jwt_secret_key_1',
    });

    if (!decodedToken) {
      throw new Error('Invalid token');
    }
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
