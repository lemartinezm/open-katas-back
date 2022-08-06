/**
 * Meta information for pagination
 */
export interface Meta {
  totalPages: number,
  currentPage: number,
  totalDocuments: number,
  documentsPerPage: number
}

export interface BasicResponse {
  status: number,
  message?: string
}

export interface AuthResponse extends BasicResponse {
  token?: string
}

export interface UsersResponse extends BasicResponse {
  users?: Array<any>,
  meta?: Meta
}

export interface KatasResponse extends BasicResponse {
  katas?: Array<any>,
  meta?: Meta
}
