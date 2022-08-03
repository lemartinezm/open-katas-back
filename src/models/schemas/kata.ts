import mongoose from 'mongoose';
import { IKata } from '../interfaces/kata.interface';

export const kataEntity = () => {
  const kataSchema = new mongoose.Schema<IKata>(
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      level: { type: String, required: true },
      intents: { type: Number, required: true },
      stars: { type: Number, required: true },
      creator: {
        creatorId: { type: mongoose.Schema.Types.ObjectId, required: true },
        creatorName: { type: String, required: true }
      },
      language: { type: String, required: true },
      solution: { type: String, required: true },
      participants: { type: [mongoose.Schema.Types.ObjectId], required: true },
      numValorations: { type: Number, required: true },
      allValorations: { type: Number, required: true }
    }
  );
  return mongoose.models.Katas || mongoose.model('Katas', kataSchema);
};
