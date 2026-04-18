import { buildApp } from "./app";
import { env } from "./config/env";
import corsPlugin from "./plugins/cors";
import { listingsRoutes } from "./modules/listings/listings.routes";
import { categoriesRoutes } from "./modules/categories/categories.routes";
import { optionsRoutes } from "./modules/options/options.routes";

async function start() {
  const app = buildApp();

  // Register plugins
  await app.register(corsPlugin);

  // Register routes
  await app.register(listingsRoutes, { prefix: "/api/listings" });
  await app.register(categoriesRoutes, { prefix: "/api/categories" });
  await app.register(optionsRoutes, { prefix: "/api/options" });

  // Health check
  app.get("/health", async (_request, reply) => {
    return reply.send({ status: "ok", timestamp: new Date().toISOString() });
  });

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    console.log(`🚀 Server running at http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
