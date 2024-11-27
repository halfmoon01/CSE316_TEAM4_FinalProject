import { useState, useEffect, useRef } from "react";
import "@/css_files/signUp.css";
import { hashutil } from "../Hashutil.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { checkAuth } from "../AuthTracker";

const SignUp = () => {
  const [memberId, setMemberId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const profileImageUrl = null;
  const position = "member";
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = checkAuth();

  useEffect(() => {
    document.title = "Sign Up Page";
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

  const ValidateSignUp = async () => {
    // 비밀번호 확인
    if (!isPasswordValid(password, passwordCheck)) {
      alert("Confirm password is not the same as password.");
      return false;
    }

    try {
      // 서버 검증 요청
      const response = await axios.post(
        "http://localhost:8080/api/signupvalidation",
        {
          email,
          memberId,
          phoneNumber,
        }
      );

      if (!response.data.success) {
        alert(response.data.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Validation failed. Please try again.");
      return false;
    }
  };

  // 비밀번호 검증 로직 분리
  const isPasswordValid = (password, passwordCheck) => {
    return password === passwordCheck;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = await ValidateSignUp();
    if (!isValid) return;

    const hashed = hashutil(memberId, password);

    try {
      await axios.post("http://localhost:8080/signup", {
        memberId,
        email,
        password: hashed,
        name,
        phoneNumber,
        profileImageUrl,
        position,
      });

      alert("Sign up successful!\nTry logging in with the account!");
      navigate("/LogIn");
    } catch (error) {
      alert("Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="sign-up-container">
      <h2>Register your account</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-item-container">
          <input
            type="text"
            id="memberId"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="Enter your ID"
            required
          />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <input
            type="password"
            id="passwordCheck"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            placeholder="Enter your password again..."
            required
          />
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            required
          />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your e-mail address"
            required
          />
          <button type="submit" id="sign-up-button">
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
