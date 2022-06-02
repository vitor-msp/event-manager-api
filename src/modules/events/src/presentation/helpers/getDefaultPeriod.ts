import { FindEventsIntputDto } from "../../app/useCases/FindEvents/FindEventsIntputDto";

export const getDefaultPeriod = (): FindEventsIntputDto => {
  const date = new Date();

  return {
    month: date.getMonth(),
    year: date.getFullYear(),
  };
};
