import { config } from "dotenv";

config();

export const env = {
  port: process.env.PORT ?? 1337,
  accessKey: process.env.ACCESS_KEY ?? "ABCD",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000"
};
