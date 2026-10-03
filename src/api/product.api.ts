import api from "./axios";


export type ProductImage = {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  category: string;
  brand: string | null;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
};


export async function getProducts() {
  const response = await api.get("/products");
  return response.data.products as Product[];
}


export async function getProduct(id: string) {
  const response = await api.get(`/products/${id}`);
  return response.data.product as Product;
}

export async function createProduct(
  formData: FormData
) {
  const response = await api.post(
    "/products",
    formData
  );

  return response.data.product as Product;
}

export async function updateProduct(
  id: string,
  formData: FormData
) {
  const response = await api.put(
    `/products/${id}`,
    formData
  );

  return response.data.product as Product;
}

export async function deleteProduct(id: string) {
  const response = await api.delete(`/products/${id}`);
  return response.data as { message: string };
}

