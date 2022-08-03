import mongoose from 'mongoose';

/**
 * Interface containing name, email, password, age, katas and role
 */
export interface UserSchema {
  name: string,
  email: string,
  password: string,
  age: number,
  katas: string[],
  role: string
}

/**
 * Interface containing _id, name, email, password, age, katas and role
 */
export interface UserFoundSchema {
  _id: mongoose.Schema.Types.ObjectId
  name: string,
  email: string,
  password: string,
  age: number,
  katas: string[],
  role: string
}
