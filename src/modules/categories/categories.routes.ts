import { FastifyInstance } from "fastify";
import * as controller from "./categories.controller";

export async function categoriesRoutes(app: FastifyInstance) {
  app.get("/", controller.listCategories);
}
