import { Schema, model } from 'mongoose';

export interface IToken {
  user: string;
  token: string;
  createdAt: string;
}

const tokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

const Token = model<IToken>('token', tokenSchema);
export default Token;
