import { NestFactory } from '@nestjs/core';
import { UsersModule } from '../users.module';
import { UserService } from '../users.service';
import { JwtService } from '@nestjs/jwt';

export const login = async (event: any) => {
  try {
    const app = await NestFactory.create(UsersModule);
    const userService = app.get(UserService);
    const jwtService = app.get(JwtService);
    const { username, password } = JSON.parse(event.body);

    const user = await userService.validateUser(username, password);
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid username or password' })
      };
    }
    const payload = { username: user.username, sub: user.id };
    const token = jwtService.sign(payload);

    return {
      statusCode: 200,
      body: JSON.stringify({ authToken: token })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }

}