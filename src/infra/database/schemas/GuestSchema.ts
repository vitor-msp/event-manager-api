import { Schema } from "mongoose";
import { IGuest } from "../../../app/interfaces/IGuest";

export const GuestSchema = new Schema<IGuest>(
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
