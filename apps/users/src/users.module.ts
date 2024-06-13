import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { DynamoDBService } from './dynamodb.service';
import { JwtStrategy } from './utils/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    JwtModule.register({
      secret: 'yourSecretKey', // replace with your secret key
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [UserService, DynamoDBService],
  controllers: [],
  providers: [UserService, DynamoDBService, JwtStrategy],
})
export class UsersModule {}
