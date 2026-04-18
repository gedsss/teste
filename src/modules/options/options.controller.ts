import { FastifyRequest, FastifyReply } from "fastify";

const fuels = [
  { id: "flex", label: "Flex" },
  { id: "gasolina", label: "Gasolina" },
  { id: "etanol", label: "Etanol" },
  { id: "diesel", label: "Diesel" },
  { id: "eletrico", label: "Elétrico" },
  { id: "hibrido", label: "Híbrido" },
];

const transmissions = [
  { id: "manual", label: "Manual" },
  { id: "automatico", label: "Automático" },
  { id: "cvt", label: "CVT" },
  { id: "automatizado", label: "Automatizado" },
];

const states = [
  { id: "AC", label: "Acre" },
  { id: "AL", label: "Alagoas" },
  { id: "AP", label: "Amapá" },
  { id: "AM", label: "Amazonas" },
  { id: "BA", label: "Bahia" },
  { id: "CE", label: "Ceará" },
  { id: "DF", label: "Distrito Federal" },
  { id: "ES", label: "Espírito Santo" },
  { id: "GO", label: "Goiás" },
  { id: "MA", label: "Maranhão" },
  { id: "MT", label: "Mato Grosso" },
  { id: "MS", label: "Mato Grosso do Sul" },
  { id: "MG", label: "Minas Gerais" },
  { id: "PA", label: "Pará" },
  { id: "PB", label: "Paraíba" },
  { id: "PR", label: "Paraná" },
  { id: "PE", label: "Pernambuco" },
  { id: "PI", label: "Piauí" },
  { id: "RJ", label: "Rio de Janeiro" },
  { id: "RN", label: "Rio Grande do Norte" },
  { id: "RS", label: "Rio Grande do Sul" },
  { id: "RO", label: "Rondônia" },
  { id: "RR", label: "Roraima" },
  { id: "SC", label: "Santa Catarina" },
  { id: "SP", label: "São Paulo" },
  { id: "SE", label: "Sergipe" },
  { id: "TO", label: "Tocantins" },
];

export async function listFuels(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send(fuels);
}

export async function listTransmissions(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.send(transmissions);
}

export async function listStates(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.send(states);
}
