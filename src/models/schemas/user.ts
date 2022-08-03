import mongoose from 'mongoose';
import { UserSchema } from '../interfaces/user.interface';

export const userEntity = () => {
  const userSchema = new mongoose.Schema<UserSchema>(
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      age: { type: Number, required: true },
      katas: { type: [], required: true },
      role: { type: String, required: true }
    }
  );
  return mongoose.models.Users || mongoose.model<UserSchema>('Users', userSchema);
};
// Cuidado con el return de modelos, al ejecutar por primera vez funciona, pero luego es necesario utilizar mongoose.models.{nombre del modelo creado} para evitar problemas de sobre escritura.
