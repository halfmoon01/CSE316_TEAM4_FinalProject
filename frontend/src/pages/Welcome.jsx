import { useEffect } from "react";
import "@/css_files/welcome.css";
import { checkAuth } from "../AuthTracker";
import { useNavigate, Link } from "react-router-dom";

const Welcome = () => {
  useEffect(() => {
    document.title = "Welcome Page";
  }, []);
  const { isLoggedIn, isLoading, name } = checkAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn) {
      alert(
        "You have to sign in first in order to access the page!\nNavigating to the Login Page..."
      );
      navigate("/LogIn");
    }
  }, [isLoading, isLoggedIn, navigate]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!isLoggedIn) {
    return <h1>No Permission!</h1>;
  }

  return (
    <div className="welcome-container">
      <h2>Welcome back, {name}</h2>
      <Link to="/HomeScreen">
        <p>Click here to go home</p>
      </Link>
    </div>
  );
};

export default Welcome;
