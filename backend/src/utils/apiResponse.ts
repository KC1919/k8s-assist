/**
 * Standard API response wrapper used by controllers.
 */
export class ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
  constructor(
    data: T,
    message: string = "Success"
  ) {
    this.success = true;
    this.message = message; 
    this.data = data;
  }
}