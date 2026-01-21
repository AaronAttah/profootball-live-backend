import { HttpStatus } from './status-codes';

export class ApiError extends Error {
  status: HttpStatus;
  constructor(status: HttpStatus, message: string) {
    super(message);
    this.status = status;
  }
}


