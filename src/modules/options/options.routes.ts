import { FastifyInstance } from "fastify";
import * as controller from "./options.controller";

export async function optionsRoutes(app: FastifyInstance) {
  app.get("/fuels", controller.listFuels);
  app.get("/transmissions", controller.listTransmissions);
  app.get("/states", controller.listStates);
}
