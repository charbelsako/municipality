import { Schema, model } from 'mongoose';

export const ROLES = {
  SuperAdmin: 'Super Admin', // Reserved for us developers
  Admin: 'Admin', // For municipality people
  Citizen: 'Citizen',
};

export interface IUser {
  idNumber: string;
  username: string;
  password: string;
  name: object;
  phoneNumberList: [string];
  email?: string;
  role: string;
}

const userSchema = new Schema(
  {
    idNumber: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: {
      title: String,
      firstName: { type: String, required: true },
      middleName: String,
      lastName: { type: String, required: true },
    },
    phoneNumberList: [String],
    email: String,
    role: { type: String, enum: Object.values(ROLES) },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>('user', userSchema);
export default User;
