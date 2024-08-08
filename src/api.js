// src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:7070'

export const fetchPaymentMethodsForUser = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/paymentMethods`);
    return response.data;
};

export const createPaymentMethod = async (userId, paymentMethod) => {
    const response = await axios.post(`${API_BASE_URL}/user/${userId}/paymentMethods`, paymentMethod);
    return response.data;
};

export const fetchTransactionsForUser = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/transactions`);
    return response.data;
};

export const createTransactionForUser = async (userId, transaction) => {
    console.log("HERE")
    const response = await axios.post(`${API_BASE_URL}/user/${userId}/transactions`, transaction);
    return response.data;
};

export const fetchMerchantsForUser = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/merchants`);
    return response.data;
};

export const createMerchantForUser = async (userId, merchant) => {
    console.log(merchant)
    const response = await axios.post(`${API_BASE_URL}/user/${userId}/merchants`, merchant);
    return response.data;
};

export const fetchCategoriesForUser = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/categories`);
    return response.data;
}

export const createCategoryForUser = async (userId, category) => {
    const response = await axios.post(`${API_BASE_URL}/user/${userId}/categories`, category);
    return response.data;
}