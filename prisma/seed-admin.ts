import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../server/lib/prisma";

async function main() {
  const email = "admin@example.com";
  const password = "AdminPassword123!";
  const name = "Admin";

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingAdmin) {
    console.log("Admin account already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Admin account created:");
  console.log({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });
}

main()
  .catch((error) => {
    console.error("Error creating admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });