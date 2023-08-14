import { Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

const DOCUMENT_TYPES = {
  Statement: 'افاده',
  LEASE_REGISTRATION: 'تسجيل عقد إيجار',
  RENTAL_FEES_DISABLED_EXEMPTION: 'طلب إعفاء معوق من رسوم التأجيرية ',
  MUNICIPAL_FEES_INSTALLMENT: 'تقسيط رسوم بلدية',
  MUNICIPAL_CLEARANCE: 'طلب براءة ذمة بلدية ',
  BUILDING_PERMIT: 'طلب ترخيص بالبناء ',
  BUILDING_PERMIT_RENEWAL: 'طلب تجديد ترخيص بالبناء ',
  // etc.
};

const DocumentRequestSchema = new Schema(
  {
    type: { type: String, enum: Object.values(DOCUMENT_TYPES) },
    callee: { type: Schema.Types.ObjectId, ref: 'user' }, // المستدعي
    address: { type: String },
    phoneNumber: { type: String },
    propertyNo: { type: String }, // عقار رقم
    sectionNo: { type: String },
    realEstateArea: { type: String }, // منطقة عقارية
    requestFor: { type: String },
    attachedDocuments: { type: [Number], ref: 'documentRequest' }, // ! not sure how this will be handled
    notes: { type: String },
  },
  { timestamps: true }
);

DocumentRequestSchema.plugin(autoIncrement, {
  model: 'documentRequest',
  field: '_id',
  startAt: 100000,
});

export const DocumentRequest = model('documentRequest', DocumentRequestSchema);
