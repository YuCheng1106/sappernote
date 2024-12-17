import type {AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import axios from 'axios';
import { message } from 'antd';
import { getToken } from '../utils/auth';

export interface HttpResponse<T = never> {
    msg: string;
    code: number;
    data: T;
}

export interface HttpError {
    msg: string;
    code: number;
}

// 设置全局 baseURL 和 withCredentials
// axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '';
axios.defaults.baseURL = 'http://127.0.0.1:8000/';
axios.defaults.withCredentials = true;

// 封装错误提示逻辑
const showError = (mes: string) => {
    message.error(mes)
};

// 请求拦截器
axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token) {
            // 使用 set 方法来设置 Authorization 头部
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// 响应拦截器
axios.interceptors.response.use(
    (response: AxiosResponse) => {
        const { code, data }: HttpResponse = response.data;
        if (code === 401) {
            // TODO: 处理 token 过期，自动刷新 token 或跳转登录界面
        }
        return data;
    },
    (error) => {
        let res: HttpError = {
            msg: '服务器响应异常，请稍后重试',
            code: 500,
        };

        if (error.response) {
            res = error.response.data;
        }

        if (error.message === 'Network Error') {
            res.msg = '服务器连接异常，请稍后重试';
        }

        if (error.code === 'ECONNABORTED') {
            res.msg = '请求超时，请稍后重试';
        }

        showError(res.msg);

        return Promise.reject(res);
    }
);

export default axios;
