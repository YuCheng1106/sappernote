import {BrowserRouter as Router, Routes, Route, Outlet, Navigate} from 'react-router-dom';
import Homepage from '../pages/home';
import NotebookPage from '../pages/notebook';
import PlaygroundPage from '../pages/playground';
import LoginPage from "../pages/login/login.tsx";
import RegisterPage from "../pages/login/register.tsx";
import {useMemo} from "react";
import {getToken} from "../utils/auth.ts";

const ProtectedRoute: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};


function AppRouter() {
    // 从 Redux 中获取用户信息

    const token = getToken();
    // 检查是否已登录
    const isLoggedIn = useMemo(() => token !== null, [token]);
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* 定义首页路径 */}
                <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
                    <Route path="/" element={<Homepage />} />

                    {/* 各个管理页面 */}
                    <Route path="notebook/:uuid" element={<NotebookPage />} />
                    <Route path="playground" element={<PlaygroundPage />} />
                </Route>
                <Route path="*" element={isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
