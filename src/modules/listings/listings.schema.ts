import { z } from "zod";

export const fuelTypes = [
  "flex",
  "gasolina",
  "etanol",
  "diesel",
  "eletrico",
  "hibrido",
] as const;

export const transmissionTypes = [
  "manual",
  "automatico",
  "cvt",
  "automatizado",
] as const;

export const listingStatuses = ["ativo", "vendido", "pausado"] as const;

export const conditions = ["novo", "seminovo", "usado"] as const;

const currentYear = new Date().getFullYear();

export const createListingSchema = z.object({
  title: z
    .string()
    .min(10, "Título deve ter no mínimo 10 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres"),
  category: z.string().min(1, "Categoria é obrigatória"),
  type: z.literal("venda").default("venda"),
  price: z.number().min(1, "Preço deve ser maior que zero"),
  priceUnit: z.string().optional(),
  year: z
    .number()
    .int()
    .min(1970, "Ano deve ser maior que 1970")
    .max(currentYear + 1, `Ano deve ser no máximo ${currentYear + 1}`),
  brand: z
    .string()
    .min(2, "Marca deve ter no mínimo 2 caracteres")
    .max(50, "Marca deve ter no máximo 50 caracteres"),
  model: z
    .string()
    .min(1, "Modelo é obrigatório")
    .max(50, "Modelo deve ter no máximo 50 caracteres"),
  km: z.number().int().min(0, "Quilometragem não pode ser negativa").optional(),
  fuel: z.enum(fuelTypes, { required_error: "Combustível é obrigatório" }),
  transmission: z.enum(transmissionTypes, {
    required_error: "Câmbio é obrigatório",
  }),
  color: z
    .string()
    .min(1, "Cor é obrigatória")
    .max(30, "Cor deve ter no máximo 30 caracteres"),
  location: z
    .string()
    .min(3, "Localização deve ter no mínimo 3 caracteres")
    .max(60, "Localização deve ter no máximo 60 caracteres"),
  state: z
    .string()
    .min(2, "Estado deve ter no mínimo 2 caracteres")
    .max(2, "Estado deve ter 2 caracteres (UF)"),
  description: z
    .string()
    .min(30, "Descrição deve ter no mínimo 30 caracteres")
    .max(2000, "Descrição deve ter no máximo 2000 caracteres"),
  images: z.array(z.string().url()).default([]),
  featured: z.boolean().default(false),
  condition: z.enum(conditions, { required_error: "Condição é obrigatória" }),
  sellerName: z
    .string()
    .min(3, "Nome do vendedor deve ter no mínimo 3 caracteres")
    .max(80, "Nome do vendedor deve ter no máximo 80 caracteres"),
  sellerPhone: z
    .string()
    .min(14, "Telefone deve ter no mínimo 14 caracteres")
    .max(16, "Telefone deve ter no máximo 16 caracteres"),
  sellerRating: z.number().min(0).max(5).default(0),
  sellerSince: z.string().default(() => new Date().toISOString().split("T")[0]),
});

export const updateListingSchema = createListingSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(listingStatuses, {
    required_error: "Status é obrigatório",
  }),
});

export const listingsQuerySchema = z.object({
  category: z.string().optional(),
  state: z.string().optional(),
  condition: z.enum(conditions).optional(),
  fuel: z.enum(fuelTypes).optional(),
  transmission: z.enum(transmissionTypes).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minYear: z.coerce.number().int().optional(),
  maxYear: z.coerce.number().int().optional(),
  brand: z.string().optional(),
  search: z.string().optional(),
  featured: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  status: z.enum(listingStatuses).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  sort: z
    .enum(["createdAt", "price", "year", "km"])
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type ListingsQuery = z.infer<typeof listingsQuerySchema>;
