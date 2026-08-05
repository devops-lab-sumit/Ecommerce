import axiosInstance from "../config/axios";

import { API } from "../constants/apiEndpoints";

import type { Payment } from "../models/payment";

const BASE_URL = `${API.PAYMENT}/api/payments`;

export async function getPayments(): Promise<Payment[]> {

    const response = await axiosInstance.get<Payment[]>(BASE_URL);

    return response.data;

}