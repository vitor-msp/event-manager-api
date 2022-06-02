import { Schema, Model, model } from "mongoose";
import { IEvent } from "../../../app/interfaces/IEvent";
import { GuestSchema } from "./GuestSchema";

export interface IEventModel extends IEvent, Document {
}

export const EventSchema = new Schema<IEventModel>(
  {
    id: {
      type: Number,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    title: {
      type: String,
      required: true,
    },
    creator: {
      type: Number,
      required: true,
    },
    guests: {
      type: [GuestSchema],
      required: true,
    },
  },
  { timestamps: true }
);

export const EventModel: Model<IEventModel> = model<IEventModel>("Event", EventSchema);
