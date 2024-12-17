import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {
    loginUser,
    logout,
    fetchUserInfo,
    fetchCaptcha,
    addUserThunk,
    updateUserThunk,
} from '../service/userService.ts';
import {LoginData, SysUserAddReq, SysUserInfoReq, UserInfo} from '../types/user.ts';
import {AppDispatch} from "../store";
import {resetUserInfo, setUserInfo} from "../store/userSlice.ts";

// Custom Hook to handle user-related dispatch actions
export function useDispatchUser() {
    const dispatch = useDispatch<AppDispatch>();

    // Login action
    const login = useCallback((loginData: LoginData) => {
        return dispatch(loginUser(loginData));
    }, [dispatch]);

    // Logout action
    const logoutUser = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    // Fetch user information
    const fetchUser = useCallback(() => {
        return dispatch(fetchUserInfo());
    }, [dispatch]);

    // Add a new user
    const addUser = useCallback((userData: SysUserAddReq) => {
        return dispatch(addUserThunk(userData));
    }, [dispatch]);

    // Update existing user
    const updateUser = useCallback((username: string, data: SysUserInfoReq) => {
        return dispatch(updateUserThunk({username, data}));
    }, [dispatch]);


    // Set partial user info
    const setUser = useCallback((info: Partial<UserInfo>) => {
        dispatch(setUserInfo(info));
    }, [dispatch]);

    // Get captcha image
    const getCaptcha = useCallback(() => {
        return dispatch(fetchCaptcha());
    }, [dispatch]);

    // Reset user information
    const resetUser = useCallback(() => {
        dispatch(resetUserInfo());
    }, [dispatch]);

    return {
        login,
        logoutUser,
        fetchUser,
        addUser,
        updateUser,
        setUser,
        resetUser,
        getCaptcha,
    };
}
