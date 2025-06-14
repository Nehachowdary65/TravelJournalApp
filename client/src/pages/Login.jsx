// client/src/pages/Login.jsx

import React from "react";
import Navbar from "../components/Navbar";
import "../styles/login.css";
import axios from "axios";
import {
    useContext,
    useState
} from "react";
import {
    useNavigate,
    Link
} from "react-router-dom";
import { AuthContext } from "../authContext";

function Login() {
    const [credentials, setCredentials] = useState({
        username: undefined,
        password: undefined,
    });

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials((prev) => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await axios.post(
                "http://localhost:5500/api/users/login", 
                credentials,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (res.data) {
                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: res.data.details
                });
                navigate('/', { replace: true });
            }
        } catch (err) {
            dispatch({
                type: "LOGIN_FAILURE",
                payload: err.response?.data?.message || "Login failed"
            });
            console.error("Login error:", err);
            alert(err.response?.data?.message || "Login failed");
        }
    };


    return (
        <div className="login">
            <Navbar />
            <div className="loginCard">
                <div className="center">
                    <h1>Welcome Back!</h1>
                    <form>
                        <div className="txt_field">
                            <input
                                type="text"
                                placeholder="username"
                                id="username"
                                onChange={handleChange}
                                className="lInput"
                            />
                        </div>
                        <div className="txt_field">
                            <input
                                type="password"
                                placeholder="password"
                                id="password"
                                onChange={handleChange}
                                className="lInput"
                            />
                        </div>
                        <div className="login_button">
                            <button className="button"
                                onClick={handleClick}>
                                Login
                            </button>
                        </div>
                        <div className="signup_link">
                            <p>
                                Not registered?
                                <Link to="/register">Register</Link>
                            </p>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default Login;