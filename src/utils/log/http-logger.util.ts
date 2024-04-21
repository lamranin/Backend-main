import expressWinston from "express-winston";
import winston from "winston";

const winstonFormat = winston.format.combine(
  winston.format.colorize({
    all: true
  }),
  winston.format.label({
    label: "[LOG]"
  }),
  winston.format.timestamp({
    format: "MMM DD, YYYY - hh:mm:ss A"
  }),

  winston.format.printf(
    (info) => `\n${info.label}  (${info.timestamp})  ${info.message}`
  )
);

export const httpLogger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(winston.format.colorize(), winstonFormat),
  msg: "[HTTP] {{req.method}} {{req.url}}",
  colorize: true
});
