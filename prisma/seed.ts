import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { slug: "carros", label: "Carros", icon: "🚗" },
  { slug: "motos", label: "Motos", icon: "🏍️" },
  { slug: "caminhoes", label: "Caminhões", icon: "🚛" },
  { slug: "vans", label: "Vans/Utilitários", icon: "🚐" },
  { slug: "pickups", label: "Pickups", icon: "🛻" },
  { slug: "suvs", label: "SUVs", icon: "🚙" },
  { slug: "classicos", label: "Clássicos", icon: "🏎️" },
  { slug: "outros", label: "Outros", icon: "⚙️" },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Upsert categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log("✅ Categories seeded");

  // Upsert sellers
  const sellers = [
    {
      id: "seller-1",
      name: "João Silva",
      phone: "(11) 99999-1111",
      rating: 4.8,
      since: "2020-01-15",
    },
    {
      id: "seller-2",
      name: "Maria Santos",
      phone: "(21) 99999-2222",
      rating: 4.9,
      since: "2019-06-20",
    },
    {
      id: "seller-3",
      name: "Carlos Oliveira",
      phone: "(31) 99999-3333",
      rating: 4.7,
      since: "2021-03-10",
    },
    {
      id: "seller-4",
      name: "Ana Costa",
      phone: "(41) 99999-4444",
      rating: 5.0,
      since: "2018-11-05",
    },
    {
      id: "seller-5",
      name: "Pedro Ferreira",
      phone: "(51) 99999-5555",
      rating: 4.6,
      since: "2022-07-22",
    },
  ];

  for (const seller of sellers) {
    await prisma.seller.upsert({
      where: { id: seller.id },
      update: seller,
      create: seller,
    });
  }
  console.log("✅ Sellers seeded");

  // Get category IDs
  const carros = await prisma.category.findUniqueOrThrow({
    where: { slug: "carros" },
  });
  const pickups = await prisma.category.findUniqueOrThrow({
    where: { slug: "pickups" },
  });
  const suvs = await prisma.category.findUniqueOrThrow({
    where: { slug: "suvs" },
  });
  const motos = await prisma.category.findUniqueOrThrow({
    where: { slug: "motos" },
  });
  const caminhoes = await prisma.category.findUniqueOrThrow({
    where: { slug: "caminhoes" },
  });
  const classicos = await prisma.category.findUniqueOrThrow({
    where: { slug: "classicos" },
  });

  // Mock listings (based on frontend mockData.ts)
  const listings = [
    {
      id: "listing-1",
      title: "Ford Ranger XLT 4x4 Diesel 2022",
      categoryId: pickups.id,
      type: "venda",
      price: 189900,
      year: 2022,
      brand: "Ford",
      model: "Ranger XLT",
      km: 35000,
      fuel: "diesel" as const,
      transmission: "automatico" as const,
      color: "Branco",
      location: "São Paulo",
      state: "SP",
      description:
        "Ford Ranger XLT 4x4 Diesel 2022 em excelente estado. Único dono, revisões em dia na concessionária. Completa com todos os opcionais de fábrica.",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      ],
      sellerId: "seller-1",
      status: "ativo" as const,
      featured: true,
      condition: "usado" as const,
    },
    {
      id: "listing-2",
      title: "Toyota Hilux SRV 4x4 Diesel 2021",
      categoryId: pickups.id,
      type: "venda",
      price: 219900,
      year: 2021,
      brand: "Toyota",
      model: "Hilux SRV",
      km: 52000,
      fuel: "diesel" as const,
      transmission: "automatico" as const,
      color: "Prata",
      location: "Campinas",
      state: "SP",
      description:
        "Toyota Hilux SRV 4x4 Diesel 2021. Veículo em ótimo estado, bem conservado, com todas as revisões feitas na concessionária Toyota.",
      images: [
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
      ],
      sellerId: "seller-2",
      status: "ativo" as const,
      featured: true,
      condition: "usado" as const,
    },
    {
      id: "listing-3",
      title: "Volkswagen Amarok V6 Highline 2023",
      categoryId: pickups.id,
      type: "venda",
      price: 299900,
      year: 2023,
      brand: "Volkswagen",
      model: "Amarok V6",
      km: 18000,
      fuel: "diesel" as const,
      transmission: "automatico" as const,
      color: "Preto",
      location: "Rio de Janeiro",
      state: "RJ",
      description:
        "Volkswagen Amarok V6 Highline 2023, seminova com apenas 18.000 km. Motor V6 258cv, a mais potente da categoria.",
      images: [
        "https://images.unsplash.com/photo-1574023278019-e8f787f7b55e?w=800",
      ],
      sellerId: "seller-3",
      status: "ativo" as const,
      featured: false,
      condition: "seminovo" as const,
    },
    {
      id: "listing-4",
      title: "Jeep Compass Limited 2.0 Flex 2022",
      categoryId: suvs.id,
      type: "venda",
      price: 169900,
      year: 2022,
      brand: "Jeep",
      model: "Compass Limited",
      km: 28000,
      fuel: "flex" as const,
      transmission: "automatico" as const,
      color: "Cinza",
      location: "Belo Horizonte",
      state: "MG",
      description:
        "Jeep Compass Limited 2022 Flex Automático. Veículo em perfeito estado, com teto solar panorâmico e todos os itens de série.",
      images: [
        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800",
      ],
      sellerId: "seller-4",
      status: "ativo" as const,
      featured: true,
      condition: "usado" as const,
    },
    {
      id: "listing-5",
      title: "Honda Civic EXL 2.0 Flex 2023",
      categoryId: carros.id,
      type: "venda",
      price: 139900,
      year: 2023,
      brand: "Honda",
      model: "Civic EXL",
      km: 12000,
      fuel: "flex" as const,
      transmission: "cvt" as const,
      color: "Azul",
      location: "Porto Alegre",
      state: "RS",
      description:
        "Honda Civic EXL 2023 com apenas 12.000 km. Carro seminovo em perfeito estado, com Honda Sensing completo.",
      images: [
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
      ],
      sellerId: "seller-5",
      status: "ativo" as const,
      featured: false,
      condition: "seminovo" as const,
    },
    {
      id: "listing-6",
      title: "Volkswagen Gol 1.0 2019",
      categoryId: carros.id,
      type: "venda",
      price: 49900,
      year: 2019,
      brand: "Volkswagen",
      model: "Gol 1.0",
      km: 78000,
      fuel: "flex" as const,
      transmission: "manual" as const,
      color: "Vermelho",
      location: "Curitiba",
      state: "PR",
      description:
        "Volkswagen Gol 1.0 2019, ótimo estado geral. Carro econômico e muito confiável para o dia a dia.",
      images: [
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
      ],
      sellerId: "seller-1",
      status: "ativo" as const,
      featured: false,
      condition: "usado" as const,
    },
    {
      id: "listing-7",
      title: "Honda CB 500F ABS 2022",
      categoryId: motos.id,
      type: "venda",
      price: 32900,
      year: 2022,
      brand: "Honda",
      model: "CB 500F",
      km: 8500,
      fuel: "gasolina" as const,
      transmission: "manual" as const,
      color: "Vermelha",
      location: "Salvador",
      state: "BA",
      description:
        "Honda CB 500F ABS 2022 em excelente estado. Moto bem conservada, sem nenhuma queda ou batida.",
      images: [
        "https://images.unsplash.com/photo-1558981285-6f0c68730b86?w=800",
      ],
      sellerId: "seller-2",
      status: "ativo" as const,
      featured: false,
      condition: "usado" as const,
    },
    {
      id: "listing-8",
      title: "Volkswagen 15.180 Delivery Express 2020",
      categoryId: caminhoes.id,
      type: "venda",
      price: 189000,
      year: 2020,
      brand: "Volkswagen",
      model: "15.180 Delivery",
      km: 145000,
      fuel: "diesel" as const,
      transmission: "manual" as const,
      color: "Branco",
      location: "Manaus",
      state: "AM",
      description:
        "Volkswagen 15.180 Delivery Express 2020. Caminhão em bom estado, motor revisado, ideal para transporte de cargas.",
      images: [
        "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
      ],
      sellerId: "seller-3",
      status: "ativo" as const,
      featured: false,
      condition: "usado" as const,
    },
  ];

  for (const listing of listings) {
    await prisma.listing.upsert({
      where: { id: listing.id },
      update: listing,
      create: listing,
    });
  }
  console.log("✅ Listings seeded");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
