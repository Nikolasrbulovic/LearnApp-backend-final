export class Training {
  id?: string;
  studentId: string;
  trainerId: string;
  name: string;
  type: TrainingType;
  date: string; 
  duration: number; 
  description?: string;
}

export class TrainingType {
  id: string;
  type: string;
}