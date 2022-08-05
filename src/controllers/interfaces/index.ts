import { UsersResponse } from '../../utils/Responses';

export interface IUserController {
  getUsers(page: number, limit: number, id?: string): Promise<UsersResponse>
  deleteUser(id: string, isAdmin: boolean): Promise<UsersResponse>
  updateUsers(id: string, isAdmin: boolean, name: string, email: string, age: number): Promise<UsersResponse>
}

export interface IKataController {
  getKatas(loggedUserId: string, page?: number, limit?: number, id?: string, filter?: any, sortType?: string): Promise<any>
  deleteKata(id: string, loggedUserId: string, isAdmin: boolean): Promise<any>
  createKatas(kata: any, loggedUserId: string): Promise<any>
  updateKatas(id: string, loggedUserId: string, isAdmin: boolean, kata: any): Promise<any>
}

export interface IAuthController {
  registerUsers(name: string, email: string, password: string, age: number): Promise<any>
  loginUsers(email: string, password: string): Promise<any>
}
