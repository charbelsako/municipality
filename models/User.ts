import { Schema, model } from 'mongoose';

export const ROLES = {
  SUPER_ADMIN: 'Super Admin', // Reserved for us developers
  ADMIN: 'Admin', // For municipality people
  CITIZEN: 'Citizen',
};

export interface IUser {
  idNumber: string;
  username: string;
  password: string;
  name: IName;
  phoneNumberList: [string];
  email?: string;
  role: string;
}

export interface IName {
  firstName: string;
  middleName?: string;
  lastName: string;
  title?: string;
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
