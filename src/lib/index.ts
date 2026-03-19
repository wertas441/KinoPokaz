import axios from "axios";

export const showErrorMessage:boolean = true;

const baseBackendUrl = 'https://api.poiskkino.dev';

const apiKey = import.meta.env.VITE_API_KEY ?? '';

export const api = axios.create({
    baseURL: `${baseBackendUrl}/v1.4`,
    withCredentials: false,
    timeout: 9000,
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
    },
});


