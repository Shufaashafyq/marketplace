import prisma from "../lib/prisma";

const LOW_STOCK_THRESHOLD = 5;

export function getStockStatus(stock: number) {
  if (stock === 0) {
    return "OUT_OF_STOCK";
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return "LOW_STOCK";
  }

  return "IN_STOCK";
}

export async function getInventory() {
  const products = await prisma.product.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      images: true,
    },
  });

  const totalUnits = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const lowStock = products.filter(
    (product) =>
      product.stock > 0 &&
      product.stock <= LOW_STOCK_THRESHOLD
  ).length;

  const outOfStock = products.filter(
    (product) => product.stock === 0
  ).length;

  const inStock = products.filter(
    (product) => product.stock > LOW_STOCK_THRESHOLD
  ).length;

  return {
    summary: {
      totalUnits,
      lowStock,
      outOfStock,
      inStock,
    },
    products,
  };
}

export async function updateInventoryStock(
  productId: string,
  stock: number
) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error("Stock must be a non-negative whole number");
  }

  return prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      stock,
    },
    include: {
      images: true,
    },
  });
}

//read products n calc inventory summary