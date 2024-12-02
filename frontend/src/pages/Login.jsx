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

  // Set the page title
  useEffect(() => {
    document.title = "Login Page";
  }, []);

  // To prevent duplicate alerts
  const alerted = useRef(false);

  // Navigates already logged-in users to the home screen.
  useEffect(() => {
    if (!isLoading && isLoggedIn && !alerted.current) {
      alerted.current = true;
      alert("Already logged in!\nNavigating...");

      navigate("/HomeScreen");
    }
  }, [isLoggedIn]);

  // Show loading screen or deny access if conditions are not met
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isLoggedIn) {
    return <h1>No Permission!</h1>;
  }

  // Handle login form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Hash the user's password before sending to the server
    const hashed = hashutil(memberId, password);

    try {
      await axios.post(
        "http://localhost:8080/signin",
        {
          memberId,
          password: hashed,
        },
        {
          // Include credentials for secure communication
          withCredentials: true,
        }
      );

      // Login successful: update state and navigate to the Welcome Page
      alert("Login successful! Welcome!");
      setIsLoggedIn(true);
      navigate("/Welcome");

      // Reload the page to refresh state
      window.location.reload();
    } catch (error) {
      // Handle login errors
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
