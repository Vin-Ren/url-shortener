import crypto from "crypto";

require("dotenv").config()

export default {
  JWT_SECRET_TOKEN: process.env.JWT_SECRET_TOKEN || crypto.randomBytes(32).toString("hex"),
  BACKEND_PORT: parseInt(process.env.BACKEND_PORT || '8080'),
  BACKEND_HOST: process.env.BACKEND_HOST || '127.0.0.1',
  JWT_LIFETIME: process.env.JWT_LIFETIME || '24h'
}
