import { NestFactory } from '@nestjs/core';
import { UsersModule } from '../users.module';
import { UserService } from '../users.service';
import { JwtService } from '@nestjs/jwt';

export const getSpecializations = async (event: any) => {
  try {
    const app = await NestFactory.create(UsersModule);
    const userService = app.get(UserService);
    const jwtService = app.get(JwtService);
    // const token = event.headers.Authorization.split(' ')[1];

    // const decodedToken = jwtService.decode(token);
    // if (!decodedToken) {
    //   throw new Error('Invalid token');
    // }
    const specializations = await userService.getAllSpecializations();
    if (specializations) {
      return {
        statusCode: 200,
        body: JSON.stringify(specializations),
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }
};
