import { Model, Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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
  // ! still not defined yet
  // EDITOR: 'Editor',
  // DATA_ENTRY: 'Data Entry',
};

export interface IUser {
  password: string;
  name: IName;
  phoneNumberList: [string];
  email: string;
  role: string[];
  refreshToken?: string;
  personalInfo: IPersonalInfo;
  sex: string;
  recordInfo: IRecordInfo;
  dateOfBirth: Date;
  isDeleted: Boolean;
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
    email: { type: String, unique: true },
    role: { type: String, enum: Object.values(ROLES) },
    refreshToken: { type: String },
    address: {
      street: String,
      area: String,
      building: String,
      floor: String,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

interface UserModel extends Model<IUser> {
  paginate: Function;
}

userSchema.plugin(mongoosePaginate);

const User = model<IUser, UserModel>('user', userSchema);

export default User;
