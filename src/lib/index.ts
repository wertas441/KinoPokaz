import axios from "axios";


export const showErrorMessage:boolean = true;

const baseBackendUrl = 'https://api.poiskkino.dev'

export const api = axios.create({
    baseURL: `${baseBackendUrl}/v1.4`,
    withCredentials: true,
    timeout: 9000,
    headers: {
        'Content-Type': 'application/json',
    }
});


