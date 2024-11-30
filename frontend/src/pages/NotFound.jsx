import { useEffect } from "react";
import { Link } from "react-router-dom";
import "@/css_files/pageNotFound.css";

const NotFound = () => {
  // Set the page title
  useEffect(() => {
    document.title = "Page Not Found";
  }, []);

  return (
    <div className="page-not-found-container">
      <h1>404: Page Not Found</h1>
      <Link to="/HomeScreen">
        <p>Click here to go home</p>
      </Link>
    </div>
  );
};

export default NotFound;
