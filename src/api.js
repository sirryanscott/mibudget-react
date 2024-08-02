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

export const getTransactionsForUser = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/transactions`);
    return response.data;
};

export const createTransactionForUser = async (userId, transaction) => {
    console.log("HERE")
    const response = await axios.post(`${API_BASE_URL}/user/${userId}/transactions`, transaction);
    return response.data;
};
