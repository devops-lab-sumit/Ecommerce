import api from "./api";
import type { Product } from "../models/product";

const endpoint = "/products";

export async function getProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>(endpoint);
    return response.data;
}

export async function getProduct(id: number): Promise<Product> {
    const response = await api.get<Product>(`${endpoint}/${id}`);
    return response.data;
}

export async function createProduct(product: Product): Promise<Product> {
    const response = await api.post<Product>(endpoint, product);
    return response.data;
}

export async function updateProduct(product: Product): Promise<void> {
    await api.put(`${endpoint}/${product.id}`, product);
}

export async function deleteProduct(id: number): Promise<void> {
    await api.delete(`${endpoint}/${id}`);
}