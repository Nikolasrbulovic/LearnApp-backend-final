import { NestFactory } from '@nestjs/core';
import { UsersModule } from '../users.module';
import { UserService } from '../users.service';
import { JwtService } from '@nestjs/jwt';

export const deleteUser = async (event: any) => {
  try {
    const app = await NestFactory.create(UsersModule);
    const userService = app.get(UserService);
    const jwtService = app.get(JwtService);
    const token = event.headers.Authorization.split(' ')[1];
    const decodedToken = jwtService.decode(token);

    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    const username = decodedToken.username;

    const userData = await userService.getUser(username);

    if (!userData) {
      throw new Error('User not found');
    }

    const userId = userData.id;

    await userService.deleteUserById(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }
};
