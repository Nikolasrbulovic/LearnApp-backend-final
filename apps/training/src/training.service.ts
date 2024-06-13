import { Injectable } from '@nestjs/common';
import { DynamoDBService } from './dynamodb.service';
import { Training } from './training.entity';
import { CreateTrainingDto } from './dto/createTrainingDto';
import { SearchTrainingsDto } from './dto/searchTrainingDto';

@Injectable()
export class TrainingService {
  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async getAllTrainings(): Promise<Training[]> {
    const trainings = await this.dynamoDBService.getAllTrainings();
    return trainings;
  }

  async postTraining(createTrainingDto: CreateTrainingDto): Promise<Training> {
    const training = { ...createTrainingDto };
    await this.dynamoDBService.postTraining(training);
    return training;
  }

  async searchTrainings(searchTrainingDto: SearchTrainingsDto) {
    const trainings =
      await this.dynamoDBService.searchTrainings(searchTrainingDto);
    return trainings;
  }
}
