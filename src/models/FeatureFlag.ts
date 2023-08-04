import { Schema } from 'mongoose';

const featureFlagSchema = new Schema({
  paymentGateway: Boolean,
  // add more here
});
