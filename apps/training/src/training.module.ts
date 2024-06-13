import { Module } from '@nestjs/common';
import { TrainingService } from './training.service';
import { DynamoDBService } from './dynamodb.service';
import { JwtStrategy } from './utils/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'apps/users/src/users.service';
import { UsersModule } from 'apps/users/src/users.module';
@Module({
  imports: [
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '2h' },
    }),
    UsersModule,
  ],
  exports: [],
  controllers: [],
  providers: [TrainingService, DynamoDBService, JwtStrategy, UserService],
})
export class TrainingModule {}
