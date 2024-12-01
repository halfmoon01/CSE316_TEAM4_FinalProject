import { useState, useEffect } from "react";
import "@/css_files/Executives.css";
import Contact from "../dialog/Contact";
import { checkAuth } from "../AuthTracker";

const Executives = () => {
  const [executives, setExecutives] = useState([]); // State to store the list of executives
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to track if the Contact dialog is open
  const [selectedExecutive, setSelectedExecutive] = useState(null); // State to store the currently selected executive
  const { isLoggedIn } = checkAuth();  // Check if the user is logged in

  // Set the page title
  useEffect(() => {
    document.title = "Executives Page";

    const fetchExecutives = async () => {
      try {
        const response = await fetch("http://localhost:8080/executives");
        if (response.ok) {
          const data = await response.json();
          setExecutives(data);  // Update the state with the fetched data
        } else {
          console.error("Failed to fetch executives.");
        }
      } catch (error) {
        console.error("Error fetching executives:", error);
      }
    };
    fetchExecutives();
  }, []);

  // Open the Contact dialog for a selected executive
  const handleOpenDialog = (executive) => {
    if (isLoggedIn) {
      setSelectedExecutive(executive); // Set the selected executive
      setIsDialogOpen(true); // Open the dialog
    } else {
      alert("You must login first to see detailed contact information!");
      return;
    }
  };
  // Close the Contact dialog
  const handleCloseDialog = () => {
    setSelectedExecutive(null);  // Clear the selected executive
    setIsDialogOpen(false); // Close the dialog
  };

  return (
    <>
    {/* Page Header */}
      <div className="executives-heading">
        <h1>Executives</h1>
        <hr />
      </div>
       {/* List of Executive Cards */}
      <div className="executives-container">
        {executives.map((executive) => (
          <div className="executive-card" key={executive.id}>
            <div className="executive-image">
              <img
                src={executive.profileImageUrl || "/user.png"} // Use a default image if profileImageUrl is not available
                alt="Executive"
              />
            </div>
            {/* Executive Details */}
            <div className="executive-content">
              {/* Executive Name */}
              <h3 className="executive-name">{executive.name}</h3>
              {/* Executive Position */}
              <p className="executive-position">{executive.position}</p>
              <br />
              <span
                className="contact-link"
                onClick={() => handleOpenDialog(executive)} // Open the dialog on click
                style={{ fontSize: "14px", fontWeight: "bold" }}
              >
                Contact Info
              </span>
            </div>
          </div>
        ))}
      </div>

      <Contact
        isOpen={isDialogOpen} // Pass the dialog open state
        onClose={handleCloseDialog} // Pass the close handler
        selectedExecutive={selectedExecutive} // Pass the selected executive
      />
    </>
  );
};

export default Executives;
