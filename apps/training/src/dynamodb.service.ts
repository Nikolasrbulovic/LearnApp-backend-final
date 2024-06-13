import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Training } from './training.entity';
import { UserService } from 'apps/users/src/users.service';
import { SearchTrainingsDto } from './dto/searchTrainingDto';
@Injectable()
export class DynamoDBService {
  private readonly dynamoDB: AWS.DynamoDB.DocumentClient;

  constructor(private readonly userService: UserService) {
    this.dynamoDB = new AWS.DynamoDB.DocumentClient({
      region: 'eu-central-1',
      endpoint: 'http://localhost:8000',
      convertEmptyValues: true,
    });
  }
  async getAllTrainings(): Promise<Training[]> {
    const params = {
      TableName: 'trainings',
    };

    try {
      const result = await this.dynamoDB.scan(params).promise();
      return result.Items as Training[];
    } catch (error) {
      throw new Error(`Unable to fetch trainings: ${error.message}`);
    }
  }

  async postTraining(
    training: Training,
  ): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
    const params = {
      TableName: 'trainings',
      Item: training,
    };

    return this.dynamoDB.put(params).promise();
  }

  async searchTrainings(
    searchTrainingDto: SearchTrainingsDto,
  ): Promise<Training[]> {
    const { trainerName, specializationName } = searchTrainingDto;
    const users = await this.userService.getUsersByFirstname(trainerName);
    console.log('0');
    if (!users) {
      throw new Error(`User with username ${trainerName} not found`);
    }
    console.log('1');
    const trainings: Training[] = [];
    for (const user of users) {
      const trainer = await this.userService.getTrainer(user.id!);
      console.log('2');
      if (!trainer) {
        throw new Error(`Trainer with userId ${user.id} not found`);
      }

      const specialization = await this.userService.getSpecialization(
        trainer.specializationId,
      );

      if (
        !specialization ||
        specialization.specialization !== specializationName
      ) {
        throw new Error(
          `Specialization ${specializationName} not found for trainer ${trainerName}`,
        );
      }

      const params = {
        TableName: 'trainings',
        FilterExpression: 'trainerId = :trainerId',
        ExpressionAttributeValues: {
          ':trainerId': trainer.userId,
        },
      };

      const result = await this.dynamoDB.scan(params).promise();
      trainings.push(result.Items?.[0] as Training);
    }
    return trainings;
  }
}
