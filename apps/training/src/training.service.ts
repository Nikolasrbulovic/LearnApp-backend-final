import { Injectable } from '@nestjs/common';
import { DynamoDBService } from './dynamodb.service';
import { Training, TrainingType } from './training.entity';
import { CreateTrainingDto } from './dto/createTrainingDto';
import { SearchTrainingsDto } from './dto/searchTrainingDto';

@Injectable()
export class TrainingService {
  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async getAllTrainings(): Promise<Training[]> {
    const trainings = await this.dynamoDBService.getAllTrainings();
    return trainings;
  }
  async getAllTrainingsByStudentId(studentId: string): Promise<Training[]> {
    const trainings =
      await this.dynamoDBService.getAllTrainingsByStudentId(studentId);
    return trainings;
  }
  async getAllTrainingsByTrainerId(trainerId: string): Promise<Training[]> {
    const trainings =
      await this.dynamoDBService.getAllTrainingsByTrainerId(trainerId);
    return trainings;
  }
  async getAllTrainingTypes(): Promise<TrainingType[]> {
    const trainings = await this.dynamoDBService.getAllTrainingTypes();
    return trainings;
  }

  async addTraining(createTrainingDto: CreateTrainingDto): Promise<Training> {
    const training = { ...createTrainingDto };
    await this.dynamoDBService.postTraining(training);
    return training;
  }

  async searchTrainings(searchTrainingDto: SearchTrainingsDto) {
    const search = { ...searchTrainingDto };
    const trainings =
      await this.dynamoDBService.getAllTrainingsByTrainerNameSpecializationDate(
        search,
      );
    return trainings;
  }
}
