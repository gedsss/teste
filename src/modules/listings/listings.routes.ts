import { FastifyInstance } from "fastify";
import * as controller from "./listings.controller";

export async function listingsRoutes(app: FastifyInstance) {
  app.get("/", controller.listListings);
  app.get("/:id", controller.getListing);
  app.post("/", controller.createListing);
  app.put("/:id", controller.updateListing);
  app.patch("/:id/status", controller.updateStatus);
  app.delete("/:id", controller.deleteListing);
}
