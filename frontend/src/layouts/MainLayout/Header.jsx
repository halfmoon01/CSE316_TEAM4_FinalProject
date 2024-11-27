import { useState } from "react";
import "@/css_files/nav.css";
import { checkAuth } from "../../AuthTracker";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoggedIn, profileImageUrl, isExecutives, logout } = checkAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      logout();
      navigate("/HomeScreen");
      alert("Logout successful!");
      window.location.reload();
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <>
      {/* Navbar for large screens */}
      <nav className="navbar-large">
        <ul>
          <li className="left-icon">
            <Link to="/HomeScreen">
              <p>CODERS US</p>
            </Link>
          </li>
          <div className="center-icons">
            {isExecutives > 0 ? (
              <li className="dropdown">
                <a href="#">ADMIN</a>
                <div className="dropdown-content">
                  <Link to="/EditAnnouncement">Edit Announcement</Link>
                  <Link to="/EditGallery">Edit Gallery</Link>
                  <Link to="/ManageAccounts">Manage Accounts</Link>
                </div>
              </li>
            ) : (
              <></>
            )}
            <li>
              <Link to="/Gallery">GALLERY</Link>
            </li>
            <li className="dropdown">
              <a href="#">MEMBERS</a>
              <div className="dropdown-content">
                <Link to="/Executives">Executives</Link>
                <Link to="/AdvisoryCommittee">Advisory Committee</Link>
              </div>
            </li>
            <li>
              <Link to="/Announcement">ANNOUNCEMENT</Link>
            </li>
            <li>
              {isLoggedIn ? (
                <Link onClick={handleLogout} className="nav-item">
                  LOGOUT
                </Link>
              ) : (
                <Link to="/LogIn" className="nav-item">
                  LOGIN
                </Link>
              )}
            </li>
          </div>

          <li className="right-icon">
            {isLoggedIn ? (
              <Link to="MyInformation">
                <img src={profileImageUrl} width="30" height="30" alt="User" />
              </Link>
            ) : (
              <></>
            )}
          </li>
        </ul>
      </nav>

      {/* Navbar for small screens */}
      <nav className="navbar-small">
        <ul>
          <li className="left-icon">
            <Link to="/HomeScreen">
              <p>CODERS US</p>
            </Link>
          </li>
          <li id="menu-icon" onClick={toggleSidebar}>
            <img src="./menu_bar_icon.png" width="30" height="30" alt="Menu" />
          </li>
        </ul>
      </nav>

      {/* Side bar menu */}
      <nav className={`side-bar ${isSidebarOpen ? "open" : ""}`}>
        <ul>
          {isExecutives > 0 ? (
            <li className="dropdown">
              <a href="#">ADMIN</a>
              <div className="dropdown-content">
                <Link to="/EditAnnouncement">Edit Announcement</Link>
                <Link to="/EditGallery">Edit Gallery</Link>
                <Link to="/ManageAccounts">Manage Accounts</Link>
              </div>
            </li>
          ) : (
            <></>
          )}
          <li>
            <Link to="/Gallery">GALLERY</Link>
          </li>
          <li className="dropdown">
            <a href="#">MEMBERS</a>
            <div className="dropdown-content">
              <Link to="/Executives">Executives</Link>
              <Link to="/AdvisoryCommittee">Advisory Committee</Link>
            </div>
          </li>
          <li>
            <Link to="/Announcement">ANNOUNCEMENT</Link>
          </li>
          <li>
            {isLoggedIn ? (
              <Link onClick={handleLogout} className="nav-item">
                LOGOUT
              </Link>
            ) : (
              <Link to="/LogIn" className="nav-item">
                LOGIN
              </Link>
            )}
          </li>
          {isLoggedIn ? (
            <li>
              <Link to="/MyInformation">MY INFORMATION</Link>
            </li>
          ) : (
            <></>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Header;