import {createAsyncThunk} from '@reduxjs/toolkit';
import {
    addUser,
    getUserInfo,
    updateUser,
} from '../api/user';
import {
    getCaptcha,
    registerUser,
    userLogin,
    userLogout
} from "../api/auth.ts";
import {clearToken} from "../utils/auth.ts";
import {
    CaptchaRes,
    LoginData,
    LoginRes,
    RegisterData,
    RegisterRes,
    SysUserAddReq,
    SysUserInfoReq
} from "../types/user.ts";


// 异步Thunk用于获取用户信息
export const fetchUserInfo = createAsyncThunk(
    'user/fetchUserInfo',
    async (_, { rejectWithValue }) => {
        try {
            return await getUserInfo();
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch user info');
        }
    }
);


export const addUserThunk = createAsyncThunk(
    'user/addUser',
    async (userData: SysUserAddReq, { rejectWithValue }) => {
        try {
            return await addUser(userData);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to add user');
        }
    }
);

// 异步Thunk用于更新用户信息
export const updateUserThunk = createAsyncThunk(
    'user/updateUser',
    async ({ username, data }: { username: string; data: SysUserInfoReq }, { rejectWithValue }) => {
        try {
            return await updateUser(username, data);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to update user');
        }
    }
);


// 异步Thunk用于登录
export const loginUser = createAsyncThunk(
    'user/login',
    async (loginForm: LoginData, { rejectWithValue }) => {
        try {
            const response = await userLogin(loginForm);
            return response as LoginRes;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('An unexpected login error occurred');
        }
    }
);

// 异步Thunk用于注册
export const register = createAsyncThunk(
    'user/register',
    async (registerForm: RegisterData, { rejectWithValue }) => {
        try {
            const response = await registerUser(registerForm);
            return response as RegisterRes;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('An unexpected register error occurred');
        }
    }
);

// 异步Thunk用于登出
export const logout = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userLogout();
            localStorage.removeItem('userToken');
            window.location.href = '/login';
            clearToken();
            return response;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('An unexpected error occurred during logout');
        }
    }
);


// 异步Thunk用于获取验证码
export const fetchCaptcha = createAsyncThunk(
    'user/fetchCaptcha',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCaptcha();
            return response as CaptchaRes;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch captcha');
        }
    }
);

