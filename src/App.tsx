import { useEffect } from "react";
import "./App.css";
import store from "./store/store";
import { setLoginStatus } from "./store/reducer";
import { useAppSelector } from "./store/hooks";
import LoginForm from "./components/login/Login";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Home from "./components/home/Home";
import { loginUser } from "./network/requests";
/**
 * Makes a request to the backend API to authenticate the user.
 * @param username :: the username to send
 * @param password :: the password to send
 */
const LoginUser = async (name: string, email: string) => {
  const success = await loginUser(name, email);
  if (success) {
    store.dispatch(setLoginStatus(true));
  }
};

const App = () => {
  const navigate = useNavigate();
  const mainState = useAppSelector((state) => state.main);

  useEffect(() => {
    navigate(mainState.loggedIn ? "/home" : "/login");
  }, [mainState.loggedIn, navigate]);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={mainState.loggedIn ? "/home" : "/login"} />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginForm onSubmit={LoginUser} />} />
      </Routes>
    </div>
  );
};

export default App;
