import "dotenv/config";
import prisma from "../server/lib/prisma";

async function main() {
  const products = [
    {
      name: "Classic Watch",
      description: "A timeless everyday watch with a clean and minimal design.",
      price: 45.0,
      category: "Accessories",
      imageUrl:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Canvas Backpack",
      description: "A lightweight canvas backpack designed for everyday use.",
      price: 35.0,
      category: "Bags",
      imageUrl:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Minimal Wallet",
      description: "A compact wallet with a simple design for everyday essentials.",
      price: 25.0,
      category: "Accessories",
      imageUrl:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Wireless Headphones",
      description: "Comfortable wireless headphones for music, calls, and everyday listening.",
      price: 60.0,
      category: "Electronics",
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Ceramic Mug",
      description: "A simple ceramic mug perfect for your morning coffee or tea.",
      price: 18.0,
      category: "Home",
      imageUrl:
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Everyday Sneakers",
      description: "Comfortable everyday sneakers with a clean and versatile look.",
      price: 55.0,
      category: "Footwear",
      imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`${products.length} demo products created.`);
}

main()
  .catch((error) => {
    console.error("Error creating demo products:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

