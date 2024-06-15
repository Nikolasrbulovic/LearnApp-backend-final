import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { DynamoDBService } from './dynamodb.service';
import { JwtStrategy } from '../../../shared/middleware/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'my_jwt_secret_key_1',
      signOptions: { expiresIn: '3h' },
    }),
  ],
  exports: [UserService, DynamoDBService],
  controllers: [],
  providers: [UserService, DynamoDBService, JwtStrategy],
})
export class UsersModule {}
