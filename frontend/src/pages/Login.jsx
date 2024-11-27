import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "@/css_files/login.css";
import { checkAuth } from "../AuthTracker";
import { hashutil } from "../Hashutil.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, setIsLoggedIn, isLoading } = checkAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login Page";
  }, []);

  const alerted = useRef(false);

  useEffect(() => {
    if (!isLoading && isLoggedIn && !alerted.current) {
      alerted.current = true;
      alert("Already logged in!\nRedirecting to Home Screen.");

      navigate("/HomeScreen");
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isLoggedIn) {
    return <h1>No Permission!</h1>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const hashed = hashutil(memberId, password);

    try {
      await axios.post(
        "http://localhost:8080/signin",
        {
          memberId,
          password: hashed, // 전송할 데이터
        },
        {
          withCredentials: true, // 옵션: 쿠키 포함
        }
      );
      alert("Login successful! Welcome!");
      setIsLoggedIn(true);
      navigate("/Welcome"); // 로그인 성공 시 대시보드로 이동
      window.location.reload();
    } catch (error) {
      alert("Invalid ID or password");
    }
  };

  return (
    <div className="login">
      <h3>Welcome to CO;Ders Us</h3>

      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          id="memberId"
          value={memberId}
          placeholder="Enter your ID"
          onChange={(e) => setMemberId(e.target.value)}
          required
        />

        <input
          type="password"
          id="password"
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
      <div className="toSignUp">
        <p>Don't have an account?</p>
        <Link to="/SignUp">Sign up Now</Link>
      </div>
    </div>
  );
};

export default Login;