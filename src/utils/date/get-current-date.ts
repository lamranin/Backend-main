import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export const getCurrentDateStart = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  return dayjs().startOf("D").tz("Asia/Dhaka").toISOString();
};

export const getCurrentDateEnd = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  return dayjs().endOf("D").tz("Asia/Dhaka").toISOString();
};
