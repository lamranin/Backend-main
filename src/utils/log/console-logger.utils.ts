import { createLogger, format, transports } from "winston";
const winstonFormat = format.combine(
  format.colorize({
    all: true
  }),
  format.label({
    label: "[LOG]"
  }),
  format.timestamp({
    format: "MMM DD, YYYY - hh:mm:ss A"
  }),
  format.printf(
    (info) =>
      `${info.label}  (${info.timestamp})  [${info.level}] ${info.message}`
  )
);
export const consolelogger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format((info) => {
          info.level = info.level.toUpperCase();
          return info;
        })(),
        format.colorize(),
        winstonFormat
      )
    })
  ]
});

export const consoleLogger = consolelogger;
