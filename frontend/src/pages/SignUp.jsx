import { useState, useEffect, useRef } from "react";
import "@/css_files/signUp.css";
import { hashutil } from "../Hashutil.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { checkAuth } from "../AuthTracker";

const SignUp = () => {
  // States to manage user input for the sign-up form
  const [memberId, setMemberId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = checkAuth();

  // Default values for optional fields
  const profileImageUrl = null;
  const position = "member";

  // Set the page title
  useEffect(() => {
    document.title = "Sign Up Page";
  }, []);

  // To prevent duplicate alerts
  const alerted = useRef(false);

  // Navigates already logged-in users to the home screen.
  useEffect(() => {
    if (!isLoading && isLoggedIn && !alerted.current) {
      alerted.current = true;
      alert("Already logged in!\nRedirecting to Home Screen.");

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

  // Helper function that validates the form before submission
  const ValidateSignUp = async () => {
    if (!isPasswordValid(password, passwordCheck)) {
      alert("Confirm password is not the same as password.");
      return false;
    }

    // If the validation above is fulfilled, validate user-provided email, ID, and phone number via API
    try {
      const response = await axios.post(
        "http://localhost:8080/api/signupvalidation",
        {
          email,
          memberId,
          phoneNumber,
        }
      );

      if (!response.data.success) {
        // Show validation failure message
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

  // Helper function to check if passwords match
  const isPasswordValid = (password, passwordCheck) => {
    return password === passwordCheck;
  };

  // Handles form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Run validation checks
    const isValid = await ValidateSignUp();
    if (!isValid) return;

    // Hash the password for secure transmission
    const hashed = hashutil(memberId, password);

    try {
      // // Submit the sign-up request to the server
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

      // Navigate to login page
      navigate("/LogIn");
    } catch (error) {
      // Handle sign-up errors
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
