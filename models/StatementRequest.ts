import { Schema, SchemaType, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const StatementRequestModel = new Schema(
  {
    callee: { type: Schema.Types.ObjectId, ref: 'user' }, // المستدعي
    address: { type: String },
    phoneNumber: { type: String },
    propertyNo: { type: String }, // عقار رقم
    sectionNo: { type: String },
    realEstateArea: { type: String },
    requestFor: { type: String },
    attachedDocuments: {}, // not sure how this will be handled
    notes: { type: String },
  },
  { timestamps: true }
);

StatementRequestModel.plugin(autoIncrement, {
  model: 'StatementRequest',
  field: '_id',
  startAt: 100000,
});
