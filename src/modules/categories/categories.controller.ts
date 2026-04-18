import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";

export async function listCategories(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const categories = await prisma.category.findMany({
    orderBy: { label: "asc" },
  });

  return reply.send(
    categories.map((cat) => ({
      id: cat.slug,
      label: cat.label,
      icon: cat.icon,
    }))
  );
}
