import { Student, Trainer } from 'apps/users/src/user.entity';

export class Training {
  id?: string;
  student: Student;
  trainer: Trainer;
  name: string;
  type: TrainingType;
  date: string;
  duration: number;
  description?: string;
}

export class TrainingType {
  id: string;
  trainingType: string;
}
