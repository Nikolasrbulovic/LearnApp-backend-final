import { NestFactory } from '@nestjs/core';
import { UsersModule } from '../users.module';
import { UserService } from '../users.service';
import { JwtService } from '@nestjs/jwt';
import { generateUniqueID } from '../utils/generateId';
import { generateUsernameAndPassword } from '../utils/generateUsernameAndPassword';
import * as bcrypt from 'bcrypt';
export const register = async (event: any) => {
  try {
    const app = await NestFactory.create(UsersModule);
    const userService = app.get(UserService);
    const jwtService = app.get(JwtService);
    const { userType, ...userData } = JSON.parse(event.body);

    const { username, password } = generateUsernameAndPassword(
      userData.firstName,
      userData.lastName,
    );

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: generateUniqueID(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      username,
      email: userData.email,
      password: hashedPassword,
      isActive: true,
      role: userType,
    };

    const user = await userService.register(newUser);
    if (userType == 'trainer') {
      const trainer = {
        id: generateUniqueID(),
        userId: newUser.id,
        specializationId: userData.specializationId,
      };
      await userService.addTrainer(trainer);
    } else {
      const student = {
        id: generateUniqueID(),
        userId: newUser.id,
        dateOfBirth: userData.dateOfBirth,
        address: userData.address,
      };
      await userService.addStudent(student);
    }
    const payload = { username: user.username, sub: user.id };
    const token = jwtService.sign(payload);

    return {
      statusCode: 200,
      body: JSON.stringify({ username, password, authToken: token }),
    };
  } catch (error) {
    console.log(error, 'xx');
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
