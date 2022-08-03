import mongoose from 'mongoose';

export interface IKata {
  name: string,
  description: string,
  level: string,
  intents: number,
  stars: number,
  creator: any,
  language: string,
  solution: string,
  participants: mongoose.Schema.Types.ObjectId[],
  numValorations: number,
  allValorations: number
}

export interface IKataFound {
  _id: mongoose.Schema.Types.ObjectId[],
  name: string,
  description: string,
  level: string,
  intents: number,
  stars: number,
  creator: any,
  language: string,
  solution: string,
  participants: mongoose.Schema.Types.ObjectId[],
  numValorations: number,
  allValorations: number
}
