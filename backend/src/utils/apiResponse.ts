export class ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
  constructor(
    data: T,
    message: string = "Success"
  ) {
    this.success = true;
    this.data = data;
    this.message = message; 
  }
}