import { NestFactory } from '@nestjs/core';
import { UsersModule } from '../users.module';
import { UserService } from '../users.service';
import { JwtService } from '@nestjs/jwt';

export const updatePassword = async (event: any) => {

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
    const { password } = requestBody;

    if (!password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'password is required' }),
      };
    }

    await userService.updatePassword(username, password);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Password updated successfully' }),
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
}