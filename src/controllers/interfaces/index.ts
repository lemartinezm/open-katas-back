import { KatasResponse, UsersResponse } from '../../utils/Responses';

export interface IUserController {
  getUsers(page: number, limit: number, id?: string): Promise<UsersResponse>
  deleteUser(id: string, isAdmin: boolean): Promise<UsersResponse>
  updateUsers(id: string, isAdmin: boolean, name: string, email: string, age: number): Promise<UsersResponse>
}

export interface IKataController {
  getKatas(
    loggedUserId: string,
    page: number,
    limit: number,
    id?: string,
    level?: string,
    language?: string,
    sortType?: string
  ): Promise<KatasResponse>

  deleteKata(
    id: string,
    loggedUserId: string,
    isAdmin: boolean
  ): Promise<KatasResponse>

  createKatas(
    name: string,
    description: string,
    level: string,
    creator: string,
    language: string,
    solution: string,
  ): Promise<KatasResponse>

  updateKatas(
    id: string,
    loggedUserId: string,
    isAdmin: boolean,
    name: string,
    description: string,
    level: string,
    creator: string,
    language: string,
    solution: string
  ): Promise<KatasResponse>

  voteKatas(
    loggedUserId: string,
    kataId: string,
    valoration: number
  ): Promise<KatasResponse>

  solveKatas(
    kataId: string,
    loggedUserId: string,
    solution: string
  ): Promise<KatasResponse>
}

export interface IAuthController {
  registerUsers(name: string, email: string, password: string, age: number): Promise<any>
  loginUsers(email: string, password: string): Promise<any>
}
