import { Schema, Model, model } from "mongoose";
import { IEvent } from "../../../app/interfaces/IEvent";
import { GuestSchema } from "./GuestSchema";

// export interface IEventModel extends Document {
//   id: number;
//   start: Date;
//   duration: number;
//   title: string;
//   creator: number;
//   guests: IGuestModel[];
// }

// export interface IGuestModel {
//   user: number;
//   permission: Permission;
// }

export const EventSchema = new Schema<IEvent>(
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

export const EventModel: Model<IEvent> = model<IEvent>("Event", EventSchema);
