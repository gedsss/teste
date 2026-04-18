import { FastifyRequest, FastifyReply } from "fastify";
import {
  createListingSchema,
  updateListingSchema,
  updateStatusSchema,
  listingsQuerySchema,
} from "./listings.schema";
import * as service from "./listings.service";

export async function listListings(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const parsed = listingsQuerySchema.safeParse(request.query);

  if (!parsed.success) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Invalid query parameters",
      details: parsed.error.flatten().fieldErrors,
      statusCode: 400,
    });
  }

  const result = await service.getListings(parsed.data);
  return reply.send(result);
}

export async function getListing(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const listing = await service.getListingById(id);

  if (!listing) {
    return reply.status(404).send({
      error: "Not Found",
      message: `Listing with id '${id}' not found`,
      statusCode: 404,
    });
  }

  return reply.send(listing);
}

export async function createListing(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const parsed = createListingSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Validation error",
      details: parsed.error.flatten().fieldErrors,
      statusCode: 400,
    });
  }

  try {
    const listing = await service.createListing(parsed.data);
    return reply.status(201).send(listing);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("not found")) {
      return reply.status(400).send({
        error: "Bad Request",
        message,
        statusCode: 400,
      });
    }
    throw err;
  }
}

export async function updateListing(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const parsed = updateListingSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Validation error",
      details: parsed.error.flatten().fieldErrors,
      statusCode: 400,
    });
  }

  try {
    const listing = await service.updateListing(id, parsed.data);

    if (!listing) {
      return reply.status(404).send({
        error: "Not Found",
        message: `Listing with id '${id}' not found`,
        statusCode: 404,
      });
    }

    return reply.send(listing);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("not found")) {
      return reply.status(400).send({
        error: "Bad Request",
        message,
        statusCode: 400,
      });
    }
    throw err;
  }
}

export async function updateStatus(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const parsed = updateStatusSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      error: "Bad Request",
      message: "Validation error",
      details: parsed.error.flatten().fieldErrors,
      statusCode: 400,
    });
  }

  const listing = await service.updateListingStatus(id, parsed.data);

  if (!listing) {
    return reply.status(404).send({
      error: "Not Found",
      message: `Listing with id '${id}' not found`,
      statusCode: 404,
    });
  }

  return reply.send(listing);
}

export async function deleteListing(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const deleted = await service.deleteListing(id);

  if (!deleted) {
    return reply.status(404).send({
      error: "Not Found",
      message: `Listing with id '${id}' not found`,
      statusCode: 404,
    });
  }

  return reply.status(204).send();
}
