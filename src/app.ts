import Fastify, { FastifyError } from "fastify";
import { env } from "./config/env";

export function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
    },
  });

  // Global error handler
  app.setErrorHandler((error: FastifyError, _request, reply) => {
    app.log.error(error);

    const statusCode = error.statusCode ?? 500;

    return reply.status(statusCode).send({
      error: error.name || "Internal Server Error",
      message:
        env.NODE_ENV === "production" && statusCode === 500
          ? "Internal Server Error"
          : error.message,
      statusCode,
    });
  });

  // 404 handler
  app.setNotFoundHandler((_request, reply) => {
    return reply.status(404).send({
      error: "Not Found",
      message: "Route not found",
      statusCode: 404,
    });
  });

  return app;
}
