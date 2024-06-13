import { NestFactory } from '@nestjs/core';
import { UsersModule } from '../users.module';
import { UserService } from '../users.service';
import { JwtService } from '@nestjs/jwt';

export const uploadPhoto = async (event: any) => {
  try {
    const app = await NestFactory.create(UsersModule);
    const userService = app.get(UserService);
    const jwtService = app.get(JwtService);

    const authHeader = event.headers.Authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwtService.decode(token);

    if (!decodedToken || typeof decodedToken !== 'object' || !decodedToken['username']) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }

    const username = decodedToken['username'];
    const requestBody = JSON.parse(event.body);
    const { photoUrl } = requestBody;

    if (!photoUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'photoUrl is required' }),
      };
    }

    await userService.updateUserPhoto(username, photoUrl);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Photo updated successfully', photoUrl }),
    };
  } catch (error) {
    console.error('Error occurred:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

