import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import {
  CreateListingInput,
  UpdateListingInput,
  UpdateStatusInput,
  ListingsQuery,
} from "./listings.schema";
import { ListingResponse, PaginatedListingsResponse } from "./listings.types";

type ListingWithRelations = Prisma.ListingGetPayload<{
  include: { category: true; seller: true };
}>;

function mapListing(listing: ListingWithRelations): ListingResponse {
  return {
    id: listing.id,
    title: listing.title,
    category: listing.category.slug,
    type: listing.type,
    price: listing.price,
    priceUnit: listing.priceUnit,
    year: listing.year,
    brand: listing.brand,
    model: listing.model,
    km: listing.km,
    fuel: listing.fuel,
    transmission: listing.transmission,
    color: listing.color,
    location: listing.location,
    state: listing.state,
    description: listing.description,
    images: listing.images,
    seller: {
      name: listing.seller.name,
      phone: listing.seller.phone,
      rating: listing.seller.rating,
      since: listing.seller.since,
    },
    status: listing.status,
    featured: listing.featured,
    createdAt: listing.createdAt.toISOString(),
    condition: listing.condition,
  };
}

export async function getListings(
  query: ListingsQuery
): Promise<PaginatedListingsResponse> {
  const {
    category,
    state,
    condition,
    fuel,
    transmission,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    brand,
    search,
    featured,
    status,
    page,
    limit,
    sort,
    order,
  } = query;

  const where: Prisma.ListingWhereInput = {};

  if (category) {
    where.category = { slug: category };
  }
  if (state) {
    where.state = { equals: state, mode: "insensitive" };
  }
  if (condition) {
    where.condition = condition;
  }
  if (fuel) {
    where.fuel = fuel;
  }
  if (transmission) {
    where.transmission = transmission;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }
  if (minYear !== undefined || maxYear !== undefined) {
    where.year = {};
    if (minYear !== undefined) where.year.gte = minYear;
    if (maxYear !== undefined) where.year.lte = maxYear;
  }
  if (brand) {
    where.brand = { contains: brand, mode: "insensitive" };
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { model: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (featured !== undefined) {
    where.featured = featured;
  }
  if (status) {
    where.status = status;
  }

  const skip = (page - 1) * limit;

  const [total, listings] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({
      where,
      include: { category: true, seller: true },
      orderBy: { [sort]: order },
      skip,
      take: limit,
    }),
  ]);

  return {
    data: listings.map(mapListing),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getListingById(
  id: string
): Promise<ListingResponse | null> {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { category: true, seller: true },
  });

  if (!listing) return null;

  return mapListing(listing);
}

export async function createListing(
  data: CreateListingInput
): Promise<ListingResponse> {
  const category = await prisma.category.findFirst({
    where: { slug: data.category },
  });

  if (!category) {
    throw new Error(`Category '${data.category}' not found`);
  }

  const seller = await prisma.seller.create({
    data: {
      name: data.sellerName,
      phone: data.sellerPhone,
      rating: data.sellerRating ?? 0,
      since: data.sellerSince ?? new Date().toISOString().split("T")[0],
    },
  });

  const listing = await prisma.listing.create({
    data: {
      title: data.title,
      type: data.type ?? "venda",
      price: data.price,
      priceUnit: data.priceUnit,
      year: data.year,
      brand: data.brand,
      model: data.model,
      km: data.km,
      fuel: data.fuel,
      transmission: data.transmission,
      color: data.color,
      location: data.location,
      state: data.state,
      description: data.description,
      images: data.images ?? [],
      featured: data.featured ?? false,
      condition: data.condition,
      categoryId: category.id,
      sellerId: seller.id,
    },
    include: { category: true, seller: true },
  });

  return mapListing(listing);
}

export async function updateListing(
  id: string,
  data: UpdateListingInput
): Promise<ListingResponse | null> {
  const existing = await prisma.listing.findUnique({
    where: { id },
    include: { seller: true },
  });

  if (!existing) return null;

  let categoryId: string | undefined;
  if (data.category) {
    const category = await prisma.category.findFirst({
      where: { slug: data.category },
    });
    if (!category) {
      throw new Error(`Category '${data.category}' not found`);
    }
    categoryId = category.id;
  }

  if (
    data.sellerName ||
    data.sellerPhone ||
    data.sellerRating !== undefined ||
    data.sellerSince
  ) {
    await prisma.seller.update({
      where: { id: existing.sellerId },
      data: {
        ...(data.sellerName && { name: data.sellerName }),
        ...(data.sellerPhone && { phone: data.sellerPhone }),
        ...(data.sellerRating !== undefined && { rating: data.sellerRating }),
        ...(data.sellerSince && { since: data.sellerSince }),
      },
    });
  }

  const listing = await prisma.listing.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.type && { type: data.type }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.priceUnit !== undefined && { priceUnit: data.priceUnit }),
      ...(data.year !== undefined && { year: data.year }),
      ...(data.brand && { brand: data.brand }),
      ...(data.model && { model: data.model }),
      ...(data.km !== undefined && { km: data.km }),
      ...(data.fuel && { fuel: data.fuel }),
      ...(data.transmission && { transmission: data.transmission }),
      ...(data.color && { color: data.color }),
      ...(data.location && { location: data.location }),
      ...(data.state && { state: data.state }),
      ...(data.description && { description: data.description }),
      ...(data.images && { images: data.images }),
      ...(data.featured !== undefined && { featured: data.featured }),
      ...(data.condition && { condition: data.condition }),
      ...(categoryId && { categoryId }),
    },
    include: { category: true, seller: true },
  });

  return mapListing(listing);
}

export async function updateListingStatus(
  id: string,
  data: UpdateStatusInput
): Promise<ListingResponse | null> {
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) return null;

  const listing = await prisma.listing.update({
    where: { id },
    data: { status: data.status },
    include: { category: true, seller: true },
  });

  return mapListing(listing);
}

export async function deleteListing(id: string): Promise<boolean> {
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) return false;

  await prisma.listing.delete({ where: { id } });
  return true;
}
