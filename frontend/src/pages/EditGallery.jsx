import { useState, useEffect, useRef } from "react";
import "@/css_files/gallery.css";
import axios from "axios";
import { checkAuth } from "../AuthTracker";
import { useNavigate } from "react-router-dom";
import ChangeGallery from "@/dialog/ChangeGallery";

const EditGallery = () => {
  // State to store the list of gallery images
  const [imageList, setImageList] = useState([]);

  // Authentication and role check
  const { isLoggedIn, isLoading, isExecutives } = checkAuth();

  // State to manage the dialog visibility for adding new images
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();

  // To prevent duplicate alerts
  const alerted = useRef(false);

  // State to track if the alert has been shown
  const [showAlert, setShowAlert] = useState(false); 

  // Set the page title
  useEffect(() => {
    document.title = "Edit Gallery Page";
  }, []);

  // Fetch gallery images when the component mounts
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/get-gallery"
        );

        // Set the image list
        setImageList(response.data.galleryData);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };
    
    fetchGallery();
  }, [isDialogOpen]);

  // Navigates unauthenticated users
  useEffect(() => {
    if (!isLoading && !isLoggedIn && !alerted.current) {
      alerted.current = true;
      alert(
        "You have to sign in first in order to access the page!\nNavigating..."
      );
      navigate("/LogIn");
    }
  }, [isLoading, isLoggedIn, navigate]);

  // Navigates non-executive users to the home screen
  useEffect(() => {
    if (!isLoading && isLoggedIn && isExecutives <= 0 && !alerted.current) {
      alerted.current = true;
      alert(
        "Only executives can access this page!\nNavigating to the Home Screen..."
      );
      navigate("/HomeScreen");
    }
  }, [isLoading, isLoggedIn, isExecutives, navigate]);

  useEffect(() => {
    if (!isLoading && isLoggedIn && isExecutives > 0) {
      setShowAlert(true); // Trigger the alert once after the page loads
    }
  }, [isLoading, isLoggedIn, isExecutives]);

  useEffect(() => {
    if (showAlert) {
      alert(
        "Clicking the Remove button will delete images without additional confirmation."
      );
    }
  }, [showAlert]);

  // Show loading screen or deny access if conditions are not met
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isExecutives <= 0) {
    return <h1>No Permission!</h1>;
  }

  // Handle image removal from the gallery
  const handleCancel = async (imageId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/gallery-delete/${imageId}`
      );

      // Update the image list by filtering out the deleted image
      setImageList((prevList) =>
        prevList.filter((image) => image.imageId !== imageId)
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="gallery-container">
      <h1>EDIT GALLERY</h1>
      <hr className="edit-gallery-line" />
      <div className="gallery-grid">
        {imageList.map((image) => (
          <div className="gallery-item" key={image.imageId}>
            <img src={image.imageUrl} alt="Gallery" id="gallery-image" />
            <button
              onClick={() => handleCancel(image.imageId)}
              className="remove-button"
            >
              REMOVE
            </button>
          </div>
        ))}
      </div>
      <button
        className="submit-button"
        id="add-button"
        onClick={() => setIsDialogOpen(true)}
      >
        ADD IMAGE
      </button>
      <ChangeGallery
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default EditGallery;
