import { Schema, model } from 'mongoose';

export const SECTS = {
  ARMENIAN_ORTHODOX: 'ارمن ارثوذكس',
  ARMENIAN_PROTESTANT: 'ارمن بروتستانت',
  ARMENIAN_CATHOLIC: 'ارمن كاثوليك',
  ASSYRIAN: 'اشوري',
  EVANGELICAL: 'انجيلي (بروتستانت)',
  ROMAN_ORTHODOX: 'روم ارثوذكس',
  ROMAN_CATHOLIC: 'روم كاثوليك',
  SYRIAC_CATHOLIC: 'سريان كاثوليك',
  SYRIAC_ORTHODOX: 'سريان ارثوذكس',
  JEHOVAH_WITNESS: 'يهوه يهوه',
  COPTIC: 'قبطي',
  COPTIC_ORTHODOX: 'قبطي ارثوذكس',
  COPTIC_CATHOLIC: 'قبطي كاثوليك',
  CHALDEAN: 'كلدان',
  CHALDEAN_ORTHODOX: 'كلدان ارثوذكس',
  CHALDEAN_CATHOLIC: 'كلدان كاثوليك',
  LATIN: 'لاتيني',
  MARONITE: 'ماروني',
  CHRISTIAN: 'مسيحي',
  NESTORIAN: 'نسطوري',
  ISMAILI: 'اسماعيليي',
  DRUZE: 'درزي',
  SUNNI: 'سني',
  SHIITE: 'شيعي',
  ALAWITE: 'علوي',
  ISRAELI: 'اسرائيلي',
  BAHAI: 'بهائي',
  BUDDHIST: 'بوذي',
  HINDU: 'هندوسي',
  UNSPECIFIED: 'غير مذكور',
  OTHER: 'مختلف',
  TO_CHECK: 'للتدقيق',
  NON_SECTARIAN: 'لا طائفي',
};

export const ROLES = {
  SUPER_ADMIN: 'Super Admin', // Reserved for us developers
  ADMIN: 'Admin', // For municipality people
  CITIZEN: 'Citizen',
};

export interface IUser {
  username: string;
  password: string;
  name: IName;
  phoneNumberList: [string];
  email?: string;
  role: string;
  refreshToken?: string;
  personalInfo: IPersonalInfo;
  sex: string;
  recordInfo: IRecordInfo;
  dateOfBirth: Date;
}

export interface IName {
  firstName: string;
  fatherName?: string;
  motherName?: string;
  lastName: string;
}

export interface IPersonalInfo {
  sect: string;
}

export interface IRecordInfo {
  sect: string;
  number: number;
}

const SEXES = { MALE: 'ذكر', FEMALE: 'أنثى' };

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sex: { type: String, enum: Object.values(SEXES) },
    name: {
      firstName: { type: String, required: true },
      fatherName: String,
      motherName: String,
      lastName: { type: String, required: true },
    },
    personalInfo: {
      sect: { type: String, enum: Object.values(SECTS) }, // مذهب
    },
    dateOfBirth: Date,
    recordInfo: {
      sect: { type: String, enum: Object.values(SECTS) },
      number: Number,
    },
    phoneNumberList: [String],
    email: String,
    role: { type: String, enum: Object.values(ROLES) },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>('user', userSchema);

export default User;
