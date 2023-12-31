import { Document, Model, Schema, model } from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import mongoosePaginate from 'mongoose-paginate-v2';

enum DocumentTypes {
  STATEMENT = 'افاده',
  LEASE_REGISTRATION = 'تسجيل عقد إيجار',
  RENTAL_FEES_DISABLED_EXEMPTION = 'طلب إعفاء معوق من رسوم التأجيرية',
  MUNICIPAL_FEES_INSTALLMENT = 'تقسيط رسوم بلدية',
  MUNICIPAL_CLEARANCE = 'طلب براءة ذمة بلدية ',
  BUILDING_PERMIT = 'طلب ترخيص بالبناء ',
  BUILDING_PERMIT_RENEWAL = 'طلب تجديد ترخيص بالبناء ',
}

export interface IDocumentRequest extends Document {
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
}

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
  DONE: 'منجز',
  PENDING: 'قيد الانتظار',
  SUBMITTED: 'قدمم',
  REJECTED: 'مرفوض',
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
    idNumber: String,
    submittedAt: Date,
  },
  { timestamps: true }
);

DocumentRequestSchema.plugin(autoIncrement, {
  model: 'documentRequest',
  field: '_id',
  startAt: 100000,
});

DocumentRequestSchema.plugin(mongoosePaginate);

interface DocumentModel extends Model<IDocumentRequest> {
  paginate: Function;
}

export const DocumentRequest = model<IDocumentRequest, DocumentModel>(
  'documentRequest',
  DocumentRequestSchema
);
