import { Schema, model } from 'mongoose';

export const ROLES = {
  SuperAdmin: 'Super Admin', // Reserved for us developers
  Admin: 'Admin',
  Citizen: 'Citizen',
};

const userSchema = new Schema(
  {
    username: String,
    password: String,
    name: {
      firstName: String,
      middleName: String,
      lastName: String,
    },
    phoneNumberList: [String],
    email: String,
    role: { type: String, enum: Object.values(ROLES) },
  },
  {
    timestamps: true,
  }
);

export const User = model('user', userSchema);
