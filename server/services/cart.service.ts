import prisma from "../lib/prisma";

export async function getUserCart(userId: string) {
  const cartItems = await prisma.cartItem.findMany({
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

  return cartItems;
}

export async function getCartItemQuantity(
  userId: string,
  productId: string
) {
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  return cartItem?.quantity ?? 0;
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number = 1
) {
  const cartItem = await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    create: {
      userId,
      productId,
      quantity,
    },
    update: {
      quantity: {
        increment: quantity,
      },
    },
    include: {
      product: {
        include: {
          images: true,
        },
      },
    },
  });

  return cartItem;
}

export async function updateCartItemQuantity(
  userId: string,
  productId: string,
  quantity: number
) {
  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return null;
  }

  const cartItem = await prisma.cartItem.update({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    data: {
      quantity,
    },
    include: {
      product: {
        include: {
          images: true,
        },
      },
    },
  });

  return cartItem;
}

export async function removeFromCart(
  userId: string,
  productId: string
) {
  await prisma.cartItem.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

export async function getCartCount(userId: string) {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
  });

  return cartItems.reduce((total: number, item) => total + item.quantity, 0);
}

export async function clearCart(userId: string) {
  await prisma.cartItem.deleteMany({
    where: { userId },
  });
}
