import { useEffect } from "react";
import "@/css_files/home_screen.css";

const HomeScreen = () => {

  useEffect(() => {
    document.title = 'Home Page';
  }, []);


  return (
    <>
      <section className="main-section">
        <h1>CO;DERS US</h1>
        <h2>Coding Education Academic Association</h2>
        <div className = "text-center">
          <p>Incheon Metropolitan City's first educational non-profit organization</p>
          <p>consisting of university students 'CO;Ders Us'</p>
        </div>
      </section>

      <section className="content-section">

          <div className="content-text">
            <h2>"Is there a way to spark students' interest in coding?"</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam tenetur amet accusantium ipsa libero dolor nesciunt distinctio voluptatum deserunt nulla aspernatur eveniet, explicabo quo, dolores assumenda cumque sint praesentium repellendus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad vero expedita vel ipsam voluptatem deserunt dolores aperiam placeat consequuntur porro, dolorum atque fugiat, blanditiis quos. Animi quos inventore vel cum.</p>

            <p><br></br>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem voluptas dolore placeat at quaerat et aut aperiam maiores esse. Voluptates dignissimos consequatur voluptatum quidem quam! Labore dolorum vel modi molestias. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat totam doloremque deserunt sequi nesciunt quasi molestiae aliquam ab tempore debitis assumenda et, perferendis ipsa commodi. Magni sequi nihil voluptatum illum.</p>
          </div>

          <div className="image-placeholder"></div>
      </section>

      <section className="content-section">
          <div className="image-placeholder"></div>
          <div className="content-text">
            <h2>"Is there a way to spark students' interest in coding?"</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam tenetur amet accusantium ipsa libero dolor nesciunt distinctio voluptatum deserunt nulla aspernatur eveniet, explicabo quo, dolores assumenda cumque sint praesentium repellendus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad vero expedita vel ipsam voluptatem deserunt dolores aperiam placeat consequuntur porro, dolorum atque fugiat, blanditiis quos. Animi quos inventore vel cum.</p>

            <p><br></br>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem voluptas dolore placeat at quaerat et aut aperiam maiores esse. Voluptates dignissimos consequatur voluptatum quidem quam! Labore dolorum vel modi molestias. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat totam doloremque deserunt sequi nesciunt quasi molestiae aliquam ab tempore debitis assumenda et, perferendis ipsa commodi. Magni sequi nihil voluptatum illum.</p>
          </div>
        </section>

      <section className="content-grid-container">
        <div className="content-text">
          <h2>"Is there a way to spark students' interest in coding?"</h2>
        </div>
        
        <div className="grid-container">
          <div className="image-placeholder"></div>
          <div className="image-placeholder"></div>
          <div className="image-placeholder"></div>
          <div className="image-placeholder"></div>
        </div>
      </section>
    </>
  );
};

export default HomeScreen;