import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
// import "./index.css";
// import RegisterPage from "./register";
import LoginPage from "./login";

function Login() {
  return (
    <Router>
      <div className="login-page">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/*<Route path="/register" element={<RegisterPage />} />*/}
        </Routes>
      </div>
    </Router>
  );
}

export default Login;
