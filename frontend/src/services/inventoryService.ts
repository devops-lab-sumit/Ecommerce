import axiosInstance from "../config/axios";
import { API } from "../constants/apiEndpoints";
import type { Product } from "../models/product";

const BASE_URL = `${API.INVENTORY}/api/products`;

export async function getProducts(): Promise<Product[]> {

    const response = await axiosInstance.get<Product[]>(BASE_URL);

    return response.data;

}

export async function createProduct(

    product: Omit<Product, "id">

): Promise<Product> {

    const response = await axiosInstance.post<Product>(

        BASE_URL,

        product

    );

    return response.data;

}

export async function deleteProduct(id: number) {

    await axiosInstance.delete(`${BASE_URL}/${id}`);

}