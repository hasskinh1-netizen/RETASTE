import mongoose, { Schema, Document } from "mongoose";

export interface RecommendationDocument extends Document {
  user_id: string;
  viewed_dishes: {
    food_id: number;
    count: number;
  }[];
  updatedAt: Date;
}

const recommendationSchema = new Schema<RecommendationDocument>(
  {
    user_id: { type: String, required: true, index: true },
    viewed_dishes: [
      {
        food_id: { type: Number, required: true },
        count: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true },
);

const Recommendation = mongoose.model<RecommendationDocument>(
  "Recommendation",
  recommendationSchema,
);
export default Recommendation;
