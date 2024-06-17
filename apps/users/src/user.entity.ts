export class User {
  id?: string;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  photo?: string;
  password?: string;
  isActive: boolean;
  role: string;
}

export class Student {
  id: string;
  userId: string;
  dateOfBirth?: string;
  address?: string;
  studentFullName: string;
}

export class Trainer {
  trainerFullName: string;
  id: string;
  userId: string;
  specializationId: string;
}
