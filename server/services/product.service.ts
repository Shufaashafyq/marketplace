import prisma from "../lib/prisma";

type CreateProductData = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
};

type ProductImageData = {
  url: string;
  publicId: string;
  isPrimary: boolean;
};

export async function createProduct(
  data: CreateProductData,
  images: ProductImageData[],
) {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category: data.category,
      brand: data.brand,
      images: {
        create: images,
      },
    },
    include: {
      images: true,
    },
  });
}

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        orderBy: {
          isPrimary: "desc",
        },
      },
    },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      images: {
        orderBy: {
          isPrimary: "desc",
        },
      },
    },
  });
}

export async function updateProduct(
  id: string,
  data: Partial<CreateProductData>,
  images?: {
    existingImageIds?: string[];
    newImages?: ProductImageData[];
  },
) {
  const productData: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
    brand?: string | null;
  } = { ...data };

  if ("brand" in data) {
    productData.brand = data.brand?.trim() ? data.brand : null;
  }

  return prisma.$transaction(async (tx) => {
    const current = await tx.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!current) {
      const error = new Error("Product not found") as Error & {
        code: string;
      };
      error.code = "P2025";
      throw error;
    }

    await tx.product.update({
      where: { id },
      data: productData,
    });

    if (images?.existingImageIds) {
      const keepIds = new Set(images.existingImageIds);
      const removed = current.images.filter(
        (image) => !keepIds.has(image.id),
      );

      if (removed.length > 0) {
        await tx.productImage.deleteMany({
          where: {
            productId: id,
            id: { in: removed.map((image) => image.id) },
          },
        });
      }
    }

    if (images?.newImages && images.newImages.length > 0) {
      const remainingCount =
        current.images.length -
        (images.existingImageIds
          ? current.images.filter(
              (image) => !images.existingImageIds!.includes(image.id),
            ).length
          : 0);

      await tx.productImage.createMany({
        data: images.newImages.map((image, index) => ({
          ...image,
          productId: id,
          isPrimary: remainingCount === 0 && index === 0,
        })),
      });
    }

    const remaining = await tx.productImage.findMany({
      where: { productId: id },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
    });

    if (remaining.length > 0 && !remaining.some((image) => image.isPrimary)) {
      await tx.productImage.update({
        where: { id: remaining[0].id },
        data: { isPrimary: true },
      });
    }

    return tx.product.findUniqueOrThrow({
      where: { id },
      include: {
        images: {
          orderBy: {
            isPrimary: "desc",
          },
        },
      },
    });
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: {
      id,
    },
    include: {
      images: true,
    },
  });
}

