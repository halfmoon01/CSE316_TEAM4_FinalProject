import { useState, useEffect } from "react";
import "@/css_files/gallery.css";
import axios from "axios";

const Gallery = () => {
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    document.title = "Gallery Page";
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

  return (
    <div className="gallery-container">
      <h1>GALLERY</h1>
      <hr className="gallery-header-line"/>
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
