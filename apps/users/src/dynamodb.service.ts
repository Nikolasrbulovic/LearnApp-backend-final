import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Student, Trainer, User } from './user.entity';
import { Specialization } from './specialization.entity';

@Injectable()
export class DynamoDBService {
  private readonly dynamoDB: AWS.DynamoDB.DocumentClient;

  constructor() {
    require('dotenv').config();

    console.log(
      process.env.LOCAL_ENDPOINT,
      process.env.AWS_ACCESS_KEY_ID,
      'xx',
    );
    this.dynamoDB = new AWS.DynamoDB.DocumentClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.LOCAL_ENDPOINT,
      convertEmptyValues: true,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async register(
    user: User,
  ): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
    const params = {
      TableName: 'users',
      Item: user,
    };

    return this.dynamoDB.put(params).promise();
  }

  async findByUsername(username: string): Promise<User | null> {
    const params = {
      TableName: 'users',
      IndexName: 'UsernameIndex',
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: { ':username': username },
    };

    const result = await this.dynamoDB.query(params).promise();
    return (result.Items?.[0] as User) || null;
  }
  async findUsersByFirstname(firstname: string): Promise<User[] | null> {
    const params = {
      TableName: 'users',
      FilterExpression: 'firstName = :firstName',
      ExpressionAttributeValues: {
        ':firstName': firstname,
      },
    };

    const result = await this.dynamoDB.scan(params).promise();
    return (result.Items as User[]) || null;
  }
  async findSpecializationById(id: string): Promise<Specialization | null> {
    const params = {
      TableName: 'specializations',
      KeyConditionExpression: '#id = :id',
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':id': id,
      },
    };

    try {
      const result = await this.dynamoDB.query(params).promise();
      return (result.Items?.[0] as Specialization) || null;
    } catch (error) {
      console.error('Error finding specialization by ID:', error);
      return null;
    }
  }
  async findAllSpecializations(): Promise<Specialization[]> {
    const params = {
      TableName: 'specializations',
    };

    try {
      const data = await this.dynamoDB.scan(params).promise();
      if (data.Items) {
        return data.Items as Specialization[];
      }
      return [];
    } catch (error) {
      console.error('Error scanning specializations:', error);
      return [];
    }
  }

  async deleteUserById(id: string): Promise<void> {
    const params = {
      TableName: 'users',
      Key: {
        id: id,
      },
    };

    await this.dynamoDB.delete(params).promise();
  }

  async updateUserPhoto(username: string, photoUrl: string): Promise<void> {
    const user = await this.findByUsername(username);

    if (!user) {
      throw new Error('User not found');
    }

    const params = {
      TableName: 'users',
      Key: {
        id: user.id,
      },
      UpdateExpression: 'set photo = :photo',
      ExpressionAttributeValues: {
        ':photo': photoUrl,
      },
    };
    await this.dynamoDB.update(params).promise();
  }

  async updatePassword(username: string, password: string): Promise<void> {
    const user = await this.findByUsername(username);

    if (!user) {
      throw new Error('User not found');
    }

    const params = {
      TableName: 'users',
      Key: {
        id: user.id,
      },
      UpdateExpression: 'set password = :password',
      ExpressionAttributeValues: {
        ':password': password,
      },
    };
    await this.dynamoDB.update(params).promise();
  }

  async addTrainer(
    trainer: Trainer,
  ): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
    const params = {
      TableName: 'trainers',
      Item: trainer,
    };

    return this.dynamoDB.put(params).promise();
  }

  async addStudent(
    student: Student,
  ): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
    const params = {
      TableName: 'students',
      Item: student,
    };

    return this.dynamoDB.put(params).promise();
  }

  async getTrainerByUserId(userId: string): Promise<Trainer | null> {
    const params = {
      TableName: 'trainers',
      IndexName: 'userIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };

    try {
      const result = await this.dynamoDB.query(params).promise();
      return (result.Items?.[0] as Trainer) || null;
    } catch (error) {
      throw new Error(`Unable to fetch trainer by userId: ${error.message}`);
    }
  }

  async getStudentByUserId(userId: string): Promise<Student | null> {
    const params = {
      TableName: 'students',
      IndexName: 'userIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };

    try {
      const result = await this.dynamoDB.query(params).promise();
      return (result.Items?.[0] as Student) || null;
    } catch (error) {
      throw new Error(`Unable to fetch trainer by userId: ${error.message}`);
    }
  }
}
