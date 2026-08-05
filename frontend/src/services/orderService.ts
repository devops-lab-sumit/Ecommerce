import axiosInstance from "../config/axios";

import { API } from "../constants/apiEndpoints";


import type { Order } from "../models/order";

export async function getOrders(): Promise<Order[]> {

    const response = await axiosInstance.get<Order[]>(BASE_URL);

    return response.data;

}
const BASE_URL = `${API.ORDER}/api/orders`;

export interface CreateOrderRequest {

    customerId: number;

    productId: number;

    quantity: number;

    amount: number;

}

export async function createOrder(

    request: CreateOrderRequest

) {

    const response = await axiosInstance.post(

        BASE_URL,

        request

    );

    return response.data;

}