import { NestFactory } from '@nestjs/core';
import { UsersModule } from '../users.module';
import { UserService } from '../users.service';
import { JwtService } from '@nestjs/jwt';
import { handleError } from 'shared/utils/handleError';

export const updatePassword = async (event: any) => {
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
    const username = decodedToken.username;
    const user = await userService.getUser(username);

    const requestBody = JSON.parse(event.body);
    const { oldPassword, newPassword, newPasswordConfirmed } = requestBody;
    if (!oldPassword || !newPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Old password and new password are required',
        }),
      };
    }
    if (newPassword !== newPasswordConfirmed) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Old and new password must match.',
        }),
      };
    }

    const isOldPasswordMatch = await userService.comparePasswords(
      oldPassword,
      user.password,
    );

    if (!isOldPasswordMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Old password is incorrect' }),
      };
    }

    await userService.updatePassword(username, newPassword);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Password updated successfully' }),
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return handleError(error);
  }
};
