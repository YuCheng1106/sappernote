import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from '../pages/home';
import NotebookPage from '../pages/notebook';
import PlaygroundPage from '../pages/playground';

function AppRouter() {
    return (
        <Router>
            <Routes>
                {/* 定义首页路径 */}
                <Route path="/" element={<Homepage />} />

                {/* 各个管理页面 */}
                <Route path="notebook/:uuid" element={<NotebookPage />} />
                <Route path="playground" element={<PlaygroundPage />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
