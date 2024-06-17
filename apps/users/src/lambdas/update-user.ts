import { NestFactory } from '@nestjs/core';
import { UsersModule } from '../users.module';
import { UserService } from '../users.service';
import { JwtService } from '@nestjs/jwt';
import { handleError } from 'shared/utils/handleError';

export const updateUser = async (event: any) => {
  try {
    const app = await NestFactory.create(UsersModule);
    const userService = app.get(UserService);
    const jwtService = app.get(JwtService);
    const token = event.headers.Authorization.split(' ')[1];
    const { dateOfBirth, address, ...userData } = JSON.parse(event.body);
    const studentData = { dateOfBirth, address };
    const decodedToken = jwtService.verify(token, {
      secret: 'my_jwt_secret_key_1',
    });

    if (!decodedToken) {
      throw new Error('Invalid token');
    }
    const userId = decodedToken.userId;
    await userService.updateUser(userData, studentData, userId);
    return {
      statusCode: 200,
      body: JSON.stringify('User updated successfully'),
    };
  } catch (error) {
    return handleError(error);
  }
};
