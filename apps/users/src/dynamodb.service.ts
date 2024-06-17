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

  async findById(id: string): Promise<User | null> {
    const params = {
      TableName: 'users',
      Key: {
        id: id,
      },
    };

    const result = await this.dynamoDB.get(params).promise();
    return (result.Item as User) || null;
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

  async updateUserPhoto(id: string, photoUrl: string): Promise<void> {
    const user = await this.findById(id);

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

  async updatePassword(id: string, password: string): Promise<void> {
    const user = await this.findById(id);

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

  async updateUserDetails(
    userId: string,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    isActive: boolean,
    dateOfBirth?: string,
    address?: string,
  ): Promise<void> {
    const user = await this.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    let updateExpression =
      'set username = :username, firstName = :firstName, lastName = :lastName, email = :email, isActive = :isActive';
    const expressionAttributeValues: { [key: string]: any } = {
      ':username': username,
      ':firstName': firstName,
      ':lastName': lastName,
      ':email': email,
      ':isActive': isActive,
    };

    const params = {
      TableName: 'users',
      Key: {
        id: user.id,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    await this.dynamoDB.update(params).promise();

    const fullName = `${firstName} ${lastName}`;

    if (dateOfBirth || address) {
      await this.updateStudentDetails(user.id, fullName, dateOfBirth, address);
    } else {
      await this.updateTrainerDetails(fullName);
    }
  }
  async updateTrainerDetails(fullName: string) {}
  async updateStudentDetails(
    userId: string,
    fullName: string,
    dateOfBirth?: string,
    address?: string,
  ): Promise<void> {
    if (!dateOfBirth && !address) {
      return;
    }

    const student = await this.getStudentByUserId(userId);

    if (!student) {
      throw new Error('Student not found');
    }

    let updateExpression = '';
    const expressionAttributeValues: { [key: string]: any } = {};

    updateExpression += 'set fullName = :fullName';
    expressionAttributeValues[':fullName'] = fullName;

    if (dateOfBirth) {
      updateExpression += ', dateOfBirth = :dateOfBirth';
      expressionAttributeValues[':dateOfBirth'] = dateOfBirth;
    }

    if (address) {
      updateExpression += ', address = :address';
      expressionAttributeValues[':address'] = address;
    }

    const params = {
      TableName: 'students',
      Key: {
        id: student.id, // Assuming `id` is the primary key for the students table
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    console.log('Updating student with params:', params);

    await this.dynamoDB.update(params).promise();
    const newstudent = await this.getStudentByUserId(userId);
    console.log(newstudent);
  }
}
