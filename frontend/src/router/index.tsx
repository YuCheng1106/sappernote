import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Homepage from "../pages/home";
import NotebookPage from "../pages/notebook";
import PlaygroundPage from "../pages/playground";

// import LayoutContainer from "../components/layout";
function AppRouter() {
    return (
        <Router>
            <Routes>

                {/* 受保护的页面，只有登录后才能访问 */}
               (
                    <>
                        <Route index element={<Homepage />} />
                        {/*<Route path="/" element={<LayoutContainer />}>*/}
                            {/* 各个管理页面 */}
                            <Route path="notebook" element={<NotebookPage />} />

                            <Route path="playground" element={<PlaygroundPage />} />

                        {/*</Route>*/}
                    </>
                )
            </Routes>
        </Router>
    );
}

export default AppRouter;
