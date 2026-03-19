import axios from "axios";

const baseBackendUrl = 'https://api.poiskkino.dev'

export const api4 = axios.create({
    baseURL: `${baseBackendUrl}/v1.4`,
    withCredentials: true,
    timeout: 9000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const api5 = axios.create({
    baseURL: `${baseBackendUrl}/v1.5`,
    withCredentials: true,
    timeout: 9000,
    headers: {
        'Content-Type': 'application/json',
    }
});
