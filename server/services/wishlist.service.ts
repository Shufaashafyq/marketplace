import prisma from "../lib/prisma";

export async function getUserWishlist(userId: string) {
  const wishlistItems = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          images: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return wishlistItems.map((item: any) => item.product);
}

export async function isProductInWishlist(
  userId: string,
  productId: string
) {
  const wishlistItem = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  return !!wishlistItem;
}

export async function addToWishlist(
  userId: string,
  productId: string
) {
  const wishlistItem = await prisma.wishlist.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    create: {
      userId,
      productId,
    },
    update: {},
    include: {
      product: {
        include: {
          images: true,
        },
      },
    },
  });

  return wishlistItem.product;
}

export async function removeFromWishlist(
  userId: string,
  productId: string
) {
  await prisma.wishlist.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

export async function getWishlistCount(userId: string) {
  const count = await prisma.wishlist.count({
    where: { userId },
  });

  return count;
}
