import { Schema } from "mongoose";
import { IGuest } from "../../../app/interfaces/IGuest";

export interface IGuestModel extends IGuest, Document {}

export const GuestSchema = new Schema<IGuestModel>(
  {
    user: {
      type: Number,
      required: true,
    },
    permission: {
      type: String,
      required: true,
    },
  },
  { _id: false, timestamps: false }
);
