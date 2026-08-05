import axiosInstance from "../config/axios";

import { API } from "../constants/apiEndpoints";

import type { Notification } from "../models/notification";

const BASE_URL = `${API.NOTIFICATION}/api/notifications`;

export async function getNotifications(): Promise<Notification[]> {

    const response = await axiosInstance.get<Notification[]>(BASE_URL);

    return response.data;

}