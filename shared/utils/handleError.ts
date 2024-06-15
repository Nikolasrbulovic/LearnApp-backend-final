import { ValidationError } from 'class-validator';

export function handleError(error: any) {
  console.error('Error in handler:', error);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (error instanceof ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.message.includes('Authorization header')) {
    statusCode = 401;
    message = 'Authorization header is missing or invalid';
  } else if (error.message === 'User not found') {
    statusCode = 404;
    message = 'User not found';
  } else if (error.message) {
    statusCode = 400;
    message = error.message;
  }

  return {
    statusCode,
    body: JSON.stringify({ message }),
  };
}
