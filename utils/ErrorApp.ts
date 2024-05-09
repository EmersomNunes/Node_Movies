export class ErrorApp {
  message: string;
  statusCode: number;

  constructor(message: string, statuscode = 400) {
    this.message = message;
    this.statusCode = statuscode;
  }
}