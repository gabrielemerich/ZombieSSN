import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://zssn-backend-example.herokuapp.com/api/'
});

