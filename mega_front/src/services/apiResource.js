import axios from "axios";

let baseURL = `http://localhost:3001/`;


const http = axios.create({
    baseURL: baseURL,
    port : 3001,
    withCredentials: false,
    timeout: 900000,
    headers: {
        "Content-type": 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
});

export { http };