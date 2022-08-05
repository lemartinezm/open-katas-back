export interface BasicResponse {
  status: number,
  message?: string
}

export interface AuthResponse extends BasicResponse {
  token?: string
}

export interface UsersResponse extends BasicResponse {
  users?: Array<any>
}

export interface KatasResponse extends BasicResponse {
  katas?: Array<any>
}
