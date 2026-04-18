import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import { env } from "../config/env";

export default async function corsPlugin(app: FastifyInstance) {
  await app.register(cors, {
    origin: [env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
}
