import mongoose, { Document, Schema } from "mongoose";

export interface IImage extends Document {
  uploaderId: mongoose.Types.ObjectId;
  title: String;
  imageUrl: String;
  order: Number;
  visibility:  'public' | 'private',
}

export const imageSchema = new Schema<IImage>(
  {
    uploaderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    imageUrl: { type: String, unique: true, required: true },
    order: { type: Number, required: true },
    visibility:  { type: String, required: true ,enum: [ 'public', 'private' ], default:'private'},
    
  },
  { timestamps: true },
);

export const Image = mongoose.model<IImage>("Image", imageSchema);
