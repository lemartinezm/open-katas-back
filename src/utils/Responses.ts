export interface BasicResponse {
  status: number,
  message?: string
}

export interface AuthResponse extends BasicResponse {
  token?: string
}
