import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateDto(dto: any, body: any): Promise<void> {
  const object = plainToInstance(dto, body);
  const errors = await validate(object);
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
}
