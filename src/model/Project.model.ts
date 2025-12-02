import { Schema, model, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  languages: string[];
  sourceCode: string;
  liveDemo: string;
  image: string;
  popularity?: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is Required"],
    },

    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
      maxlength: [200000, "Description is too long"],
    },

    languages: {
      type: [String],
      required: [true, "Languages are required"],
    },

    sourceCode: {
      type: String,
      trim: true,
      required: [true, "Source code link is required"],
    },

    liveDemo: {
      type: String,
      trim: true,
      required: [true, "Live demo link is required"],
    },

    image: {
      type: String,
      required: [true, "Image is Required."],
    },

    popularity: {
      type: String,
      enum: ["New", "Popular", "Featured"],
    },
  },
  {
    timestamps: true,
  }
);

export const Project = model<IProject>("Project", ProjectSchema);
