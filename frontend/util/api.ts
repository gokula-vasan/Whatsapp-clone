import axios from "axios";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL || "http://172.31.95.20:5000/api";
export const fetchUser = async (phone: string) => {
        if (!phone) return;
        try {
            const response = await axios.get(`${API_URL}/users/${encodeURIComponent(phone)}`);
            return response.data;
        } catch (error) {
            console.log("fetchUser API error", error);
        }
    };


export const updateUser = async (Id: string, formData: any) => {
    try {
        const response = await axios.put(`${API_URL}/users/${Id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.log("UpdateUser API error", error);
    }
};


export const saveUser = async (formData: any) => {
    try {
        const response = await axios.post(`${API_URL}/users`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.log("saveUser API Failed", error);
    }
};