export interface ApiResponseDTO<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}
