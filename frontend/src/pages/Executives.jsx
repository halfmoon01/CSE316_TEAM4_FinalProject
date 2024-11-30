import { useState, useEffect } from "react";
import "@/css_files/Executives.css";
import UserIcon from "../../public/user.png";
import Contact from "../dialog/Contact";
import { checkAuth } from "../AuthTracker";

const Executives = () => {
  const [executives, setExecutives] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const { isLoggedIn } = checkAuth();

  // Set the page title
  useEffect(() => {
    document.title = "Executives Page";

    const fetchExecutives = async () => {
      try {
        const response = await fetch("http://localhost:8080/executives");
        if (response.ok) {
          const data = await response.json();
          setExecutives(data);
        } else {
          console.error("Failed to fetch executives.");
        }
      } catch (error) {
        console.error("Error fetching executives:", error);
      }
    };
    fetchExecutives();
  }, []);

  const handleOpenDialog = (executive) => {
    if (isLoggedIn) {
      setSelectedExecutive(executive);
      setIsDialogOpen(true);
    } else {
      alert("You must login first to see detailed contact information!");
      return;
    }
  };

  const handleCloseDialog = () => {
    setSelectedExecutive(null);
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="executives-heading">
        <h1>Executives</h1>
        <hr />
      </div>

      <div className="executives-container">
        {executives.map((executive) => (
          <div className="executive-card" key={executive.id}>
            <div className="executive-image">
              <img
                src={executive.profileImageUrl || UserIcon}
                alt="Executive"
              />
            </div>
            <div className="executive-content">
              <h3 className="executive-name">{executive.name}</h3>
              <p className="executive-position">{executive.position}</p>
              <br />
              <span
                className="contact-link"
                onClick={() => handleOpenDialog(executive)}
                style={{ fontSize: "14px", fontWeight: "bold" }}
              >
                Contact Info
              </span>
            </div>
          </div>
        ))}
      </div>

      <Contact
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        selectedExecutive={selectedExecutive}
      />
    </>
  );
};

export default Executives;
