import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    loginUser,
    logout,
    fetchCaptcha,
    fetchUserInfo,
} from '../service/userService.ts';
import { setToken, clearToken } from '../utils/auth';
import {UserState} from "../types/user.ts";
import {UserInfo} from "../types/user.ts";

const initialState: UserState = {
    user: {
        id: -1,
        username: '',
        avatar: '',
        nickname: '',
    },
    captcha: '',
    status: 'idle',
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        // Reset announcement information
        resetUserInfo: (state) => {
            state.user = {
                id: -1,
                username: '',
                avatar: '',
                nickname: '',
            };
            state.captcha = '';
            state.status = 'idle';
            state.error = null;
        },
        // Set partial announcement information
        setUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
    extraReducers: (builder) => {
        // Handle login
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                setToken(action.payload.access_token);
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Handle logout
        builder
            .addCase(logout.fulfilled, (state) => {
                state.status = 'succeeded';
                state = initialState;
                clearToken();
            });

        // Handle captcha fetching
        builder
            .addCase(fetchCaptcha.fulfilled, (state, action) => {
                state.captcha = `data:image/png;base64, ${action.payload.image}`;
                state.status = 'succeeded';
            })
            .addCase(fetchCaptcha.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Handle fetching user info
        builder
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

    },
});

export const { resetUserInfo, setUserInfo } = userSlice.actions;

export default userSlice.reducer;
