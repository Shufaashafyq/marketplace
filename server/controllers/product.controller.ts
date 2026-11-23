import { Request, Response } from "express";
import { createProductSchema } from "../schemas/product.schema";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service";
import { deleteImage, uploadImage } from "../services/cloudinary.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import prisma from "../lib/prisma";
import { createLog } from "../services/audit.service";


function isNotFound(error: unknown) {
  return (
    error instanceof Error &&
    (error as any).code === "P2025"
  );
}

async function recordAdminAction(
  req: AuthenticatedRequest,
  data: {
    action: string;
    entityType: string;
    entityId?: string;
    entityName: string;
    details?: Record<string, unknown>;
  },
) {
  try {
    if (!req.user) return;

    const admin = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        name: true,
      },
    });

    if (!admin) return;

    await createLog({
      ...data,
      adminId: req.user.userId,
      adminName: admin.name,
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

//validate data with zod,check imgs exist
export async function create(req: AuthenticatedRequest, res: Response,) {
  try {
    const result = createProductSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "At least one product image is required.",
      });
    }

    const uploadedImages = await Promise.all(
      files.map(async (file, index) => {
        const result = await uploadImage(file.buffer);

        return {
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary: index === 0,
        };
      }),
    );

    const product = await createProduct(
      result.data,
      uploadedImages,
    );

    await recordAdminAction(req, {
      action: "CREATE_PRODUCT",
      entityType: "PRODUCT",
      entityId: product.id,
      entityName: product.name,
      details: {
        price: product.price.toString(),
        stock: product.stock,
        category: product.category,
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

//return all products
export async function getAll(
  _req: Request,
  res: Response,
) {
  try {
    const products = await getProducts();

    return res.status(200).json({
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

//return one product
export async function getOne(
  req: Request,
  res: Response,
) {
  try {
    const product = await getProductById(
      req.params.id as string,
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function update(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const result = createProductSchema
      .partial()
      .safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const files = req.files as Express.Multer.File[] | undefined;
    let existingImageIds: string[] | undefined;

    if (typeof req.body.existingImageIds === "string") {
      try {
        const parsed = JSON.parse(req.body.existingImageIds);

        if (
          !Array.isArray(parsed) ||
          parsed.some((id) => typeof id !== "string")
        ) {
          return res.status(400).json({
            message: "existingImageIds must be an array of image ids.",
          });
        }

        existingImageIds = parsed;
      } catch {
        return res.status(400).json({
          message: "existingImageIds must be valid JSON.",
        });
      }
    }

    const current = await getProductById(req.params.id as string);

    if (!current) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const keptCount = existingImageIds
      ? current.images.filter((image) =>
          existingImageIds!.includes(image.id),
        ).length
      : current.images.length;
    const newFileCount = files?.length ?? 0;

    if (existingImageIds || newFileCount > 0) {
      if (keptCount + newFileCount === 0) {
        return res.status(400).json({
          message: "At least one product image is required.",
        });
      }

      if (keptCount + newFileCount > 10) {
        return res.status(400).json({
          message: "You can upload a maximum of 10 images.",
        });
      }
    }

    const newImages = files?.length
      ? await Promise.all(
          files.map(async (file) => {
            const uploaded = await uploadImage(file.buffer);

            return {
              url: uploaded.secure_url,
              publicId: uploaded.public_id,
              isPrimary: false,
            };
          }),
        )
      : [];

    const removedImages = existingImageIds
      ? current.images.filter(
          (image) => !existingImageIds!.includes(image.id),
        )
      : [];

    const product = await updateProduct(
      req.params.id as string,
      result.data,
      {
        existingImageIds,
        newImages,
      },
    );

    await recordAdminAction(req, {
      action: "UPDATE_PRODUCT",
      entityType: "PRODUCT",
      entityId: product.id,
      entityName: product.name,
      details: {
        before: {
          name: current.name,
          price: current.price.toString(),
          stock: current.stock,
          category: current.category,
          brand: current.brand,
        },
        after: {
          name: product.name,
          price: product.price.toString(),
          stock: product.stock,
          category: product.category,
          brand: product.brand,
        },
      },
    });

    await Promise.all(
      removedImages.map((image) =>
        deleteImage(image.publicId).catch((error) => {
          console.error("Failed to delete Cloudinary image:", error);
        }),
      ),
    );

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    if (isNotFound(error)) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    console.error("Update product error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function remove(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const product = await getProductById(req.params.id as string);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await deleteProduct(req.params.id as string);

    //save product info in audit record after deletion
    await recordAdminAction(req, {
      action: "DELETE_PRODUCT",
      entityType: "PRODUCT",
      entityId: product.id,
      entityName: product.name,
      details: {
        price: product.price.toString(),
        stock: product.stock,
        category: product.category,
      },
    });

    await Promise.all(
      product.images.map((image) =>
        deleteImage(image.publicId).catch((error) => {
          console.error("Failed to delete Cloudinary image:", error);
        }),
      ),
    );

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    if (isNotFound(error)) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    console.error("Delete product error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

//validates product, process uploaded images, tells service what to save