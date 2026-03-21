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

export const appNavItems = [
    { id: 1, label: "Главная", to: "/"},
    { id: 2, label: "Каталог фильмов", to: "/movies"},
    { id: 3, label: "Избранные фильмы", to: "/favorites"},
] as const;



