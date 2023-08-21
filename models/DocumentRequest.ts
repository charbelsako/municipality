import { Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

enum DocumentTypes {
  STATEMENT = 'افاده',
  LEASE_REGISTRATION = 'تسجيل عقد إيجار',
  RENTAL_FEES_DISABLED_EXEMPTION = 'طلب إعفاء معوق من رسوم التأجيرية',
  MUNICIPAL_FEES_INSTALLMENT = 'تقسيط رسوم بلدية',
  MUNICIPAL_CLEARANCE = 'طلب براءة ذمة بلدية ',
  BUILDING_PERMIT = 'طلب ترخيص بالبناء ',
  BUILDING_PERMIT_RENEWAL = 'طلب تجديد ترخيص بالبناء ',
}

type IDocumentRequest = {
  type: DocumentTypes;
  callee: string; // المستدعي
  address: string;
  phoneNumber: string;
  propertyNo: string; // عقار رقم
  sectionNo: string;
  realEstateArea: string; // منطقة عقارية
  requestFor: string;
  attachedDocuments: number[]; // ! not sure how this will be handled
  notes: string;
  status: string;
};

export const DOCUMENT_TYPES = {
  STATEMENT: 'افاده',
  LEASE_REGISTRATION: 'تسجيل عقد إيجار',
  RENTAL_FEES_DISABLED_EXEMPTION: 'طلب إعفاء معوق من رسوم التأجيرية',
  MUNICIPAL_FEES_INSTALLMENT: 'تقسيط رسوم بلدية',
  MUNICIPAL_CLEARANCE: 'طلب براءة ذمة بلدية ',
  BUILDING_PERMIT: 'طلب ترخيص بالبناء ',
  BUILDING_PERMIT_RENEWAL: 'طلب تجديد ترخيص بالبناء ',
  // etc.
};

export const DocumentStatus = {
  DONE: 'Done',
  PENDING: 'Pending',
  REJECTED: 'Rejected',
};

const DocumentRequestSchema = new Schema(
  {
    type: { type: String, enum: Object.values(DOCUMENT_TYPES) },
    callee: { type: Schema.Types.ObjectId, ref: 'user' }, // المستدعي
    address: { type: String },
    phoneNumber: { type: String },
    propertyNo: { type: String }, // عقار رقم
    sectionNo: { type: String }, // رقم القسم
    realEstateArea: { type: String }, // منطقة عقارية
    requestFor: { type: String },
    attachedDocuments: { type: [Number], ref: 'documentRequest' }, // ! not sure how this will be handled
    notes: { type: String },
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.PENDING,
    },
  },
  { timestamps: true }
);

DocumentRequestSchema.plugin(autoIncrement, {
  model: 'documentRequest',
  field: '_id',
  startAt: 100000,
});

export const DocumentRequest = model<IDocumentRequest>(
  'documentRequest',
  DocumentRequestSchema
);
