import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Training, TrainingType } from './training.entity';
import { UserService } from 'apps/users/src/users.service';

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
  async getAllTrainingsByStudentId(studentId: string): Promise<Training[]> {
    const params = {
      TableName: 'trainings',
      FilterExpression: '#student.#id = :studentId',
      ExpressionAttributeNames: {
        '#student': 'student',
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':studentId': studentId,
      },
    };
    try {
      const result = await this.dynamoDB.scan(params).promise();
      console.log('Scan result:', result);
      return result.Items as Training[];
    } catch (error) {
      console.error('Error scanning trainings by studentId:', error);
      throw new Error('Error scanning trainings by studentId');
    }
  }

  async getAllTrainingsByTrainerId(trainerId: string): Promise<Training[]> {
    const params = {
      TableName: 'trainings',
      FilterExpression: '#trainer.#id = :trainerId',
      ExpressionAttributeNames: {
        '#trainer': 'trainer',
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':trainerId': trainerId,
      },
    };

    try {
      const result = await this.dynamoDB.scan(params).promise();

      return result.Items as Training[];
    } catch (error) {
      console.error('Error scanning trainings by trainerId:', error);
      throw new Error('Error scanning trainings by trainerId');
    }
  }
  async getAllTrainingTypes(): Promise<TrainingType[]> {
    const params = {
      TableName: 'trainingType',
    };

    try {
      const result = await this.dynamoDB.scan(params).promise();
      return result.Items as TrainingType[];
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

  async getAllTrainingsByTrainerNameSpecializationDate(searchParams: {
    trainerName?: string;
    specialization?: string;
    date?: string;
  }): Promise<Training[]> {
    const { trainerName, specialization, date } = searchParams;

    // Initialize filter expression components
    const filterExpressions: string[] = [];
    const expressionAttributeNames: { [key: string]: string } = {};
    const expressionAttributeValues: { [key: string]: any } = {};

    // Add filter expressions based on provided parameters
    if (trainerName) {
      filterExpressions.push('#trainer.#name = :trainerName');
      expressionAttributeNames['#trainer'] = 'trainer';
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':trainerName'] = trainerName;
    }

    if (specialization) {
      filterExpressions.push('#specialization = :specialization');
      expressionAttributeNames['#specialization'] = 'specialization';
      expressionAttributeValues[':specialization'] = specialization;
    }

    if (date) {
      filterExpressions.push('#date = :date');
      expressionAttributeNames['#date'] = 'date';
      expressionAttributeValues[':date'] = date;
    }

    // Combine filter expressions
    const filterExpression = filterExpressions.join(' AND ');

    // Ensure filter expression is not empty
    if (!filterExpression.trim()) {
      throw new Error('FilterExpression must not be empty');
    }

    const params: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: 'trainings',
      FilterExpression: filterExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    let allTrainings: Training[] = [];
    let lastEvaluatedKey: AWS.DynamoDB.DocumentClient.Key | undefined =
      undefined;

    try {
      do {
        const currentParams = {
          ...params,
          ExclusiveStartKey: lastEvaluatedKey,
        };
        const result = await this.dynamoDB.scan(currentParams).promise();

        if (result.Items) {
          allTrainings = [...allTrainings, ...(result.Items as Training[])];
        }

        lastEvaluatedKey = result.LastEvaluatedKey;
      } while (lastEvaluatedKey);

      console.log('All trainings:', allTrainings);
      return allTrainings;
    } catch (error) {
      console.error(
        'Error scanning trainings by trainerName, specialization, and date:',
        error,
      );
      throw new Error(
        'Error scanning trainings by trainerName, specialization, and date',
      );
    }
  }
}
