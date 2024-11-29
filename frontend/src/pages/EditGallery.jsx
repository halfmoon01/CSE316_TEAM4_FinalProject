import { useState, useEffect, useRef } from "react";
import "@/css_files/gallery.css";
import axios from "axios";
import { checkAuth } from "../AuthTracker";
import { useNavigate } from "react-router-dom";
import ChangeGallery from "@/dialog/ChangeGallery";

const EditGallery = () => {
  const [imageList, setImageList] = useState([]);
  const { isLoggedIn, isLoading, isExecutives } = checkAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();
  const alerted = useRef(false);
  useEffect(() => {
    document.title = "Edit Gallery Page";
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/get-gallery"
        );
        setImageList(response.data.galleryData);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };

    fetchGallery();
  }, []);

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !alerted.current) {
      alerted.current = true;
      alert(
        "You have to sign in first in order to access the page!\nNavigating to the Login Page..."
      );
      navigate("/LogIn");
    }
  }, [isLoading, isLoggedIn, navigate]);

  useEffect(() => {
    if (!isLoading && isLoggedIn && isExecutives <= 0 && !alerted.current) {
      alerted.current = true;
      alert(
        "Only executives can access this page!\nNavigating to the Home Screen..."
      );
      navigate("/HomeScreen");
    }
  }, [isLoading, isLoggedIn, isExecutives, navigate]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  
  if (isExecutives <= 0) {
    return <h1>No Permission!</h1>;
  }

  const handleCancel = async (imageId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/gallery-delete/${imageId}`
      );
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
      <hr />
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
