import axios from 'axios';
import {CaptchaRes, LoginData, LoginRes, RegisterData, RegisterRes} from "../types/user.ts";


export function getCaptcha(): Promise<CaptchaRes> {
    return axios.get('/api/v1/auth/captcha');
}

export function userLogin(data: LoginData): Promise<LoginRes> {
    return axios.post('/api/v1/auth/login', data);
}

export function registerUser(data: RegisterData): Promise<RegisterRes> {
    return axios.post('/api/v1/auth/register', data);
}

export function userLogout() {
    return axios.post('/api/v1/auth/logout');
}
