import axiosInstance from "../config/axios";
import { API } from "../constants/apiEndpoints";
import type { Customer } from "../models/customer";

const BASE_URL = `${API.CUSTOMER}/api/customers`;

export const getCustomers = async (): Promise<Customer[]> => {

    const response = await axiosInstance.get<Customer[]>(BASE_URL);

    return response.data;

};

export const createCustomer = async (
    customer: Omit<Customer, "id">
): Promise<Customer> => {

    const response = await axiosInstance.post<Customer>(
        BASE_URL,
        customer
    );

    return response.data;

};

export const deleteCustomer = async (
    id:number
) => {

    await axiosInstance.delete(`${BASE_URL}/${id}`);

};