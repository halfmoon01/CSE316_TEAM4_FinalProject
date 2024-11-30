import { useState, useEffect } from "react";
import "@/css_files/gallery.css";
import axios from "axios";
import { checkAuth } from "../AuthTracker";

const Gallery = () => {
  // State to store the list of gallery images
  const [imageList, setImageList] = useState([]);

  // Destructure loading status from authentication check
  const { isLoading } = checkAuth();

  // Set the page title
  useEffect(() => {
    document.title = "Gallery Page";
  }, []);

  // Fetch gallery data from the server when the component mounts
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

  // Display a loading message if data is still being fetched
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="gallery-container">
      <h1>GALLERY</h1>
      <hr className="gallery-header-line" />
      <div className="gallery-grid">
        {imageList.map((image) => (
          <div className="gallery-item" key={image.imageId}>
            <img src={image.imageUrl} alt="Gallery" id="gallery-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
