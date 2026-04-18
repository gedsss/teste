import {
  FuelType,
  TransmissionType,
  ListingStatus,
  Condition,
} from "@prisma/client";

export interface ListingResponse {
  id: string;
  title: string;
  category: string;
  type: string;
  price: number;
  priceUnit: string | null;
  year: number;
  brand: string;
  model: string;
  km: number | null;
  fuel: FuelType;
  transmission: TransmissionType;
  color: string;
  location: string;
  state: string;
  description: string;
  images: string[];
  seller: {
    name: string;
    phone: string;
    rating: number;
    since: string;
  };
  status: ListingStatus;
  featured: boolean;
  createdAt: string;
  condition: Condition;
}

export interface PaginatedListingsResponse {
  data: ListingResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
