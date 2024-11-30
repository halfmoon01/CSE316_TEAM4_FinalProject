import { useEffect } from "react";
import "@/css_files/home_screen.css";

const HomeScreen = () => {
  // Set the page title
  useEffect(() => {
    document.title = "Home Page";
  }, []);

  return (
    <>
      <section className="main-section">
        <h1>CO;DERS US</h1>
        <h2>Coding Education Academic Association</h2>
        <div className="text-center">
          <p>
            Incheon Metropolitan City's first educational non-profit
            organization
          </p>
          <p>consisting of university students 'CO;Ders Us'</p>
        </div>
      </section>

      <section className="content-section">
        <div className="content-text">
          <h2>"Is there a way to spark students' interest in coding?"</h2>
          <p>
            The beginning of CO;Ders Us was simple. Our goal was to create an
            environment where future talents could escape exam-focused coding
            education and instead experience the true joy of coding early on,
            allowing them to fully immerse themselves in it. Driven by the
            desire to share the fun of coding with more students, a group of
            college students developed a broader vision.
          </p>

          <p>
            <br></br>This led to the introduction of not only coding classes but
            also STEAM education. CO;Ders Us crafted a unique mentoring
            curriculum that integrates Science, Technology, Engineering, Arts,
            and Mathematics. Rather than relying on one-sided teaching methods,
            this approach fostered a new educational environment where
            elementary, middle, and high school students could interact and
            communicate with college students.
          </p>
        </div>

        <img
          src="https://cdn.ngonews.kr/news/photo/202407/154316_124360_283.jpg"
          alt="A teacher guiding a student in a hands-on learning activity with a tablet and electronics."
          className="image-sizer"
        />
      </section>

      <section className="content-section">
        <img
          src="https://static.wixstatic.com/media/220428_3c9c43a08cfb47c89785e9f85938b7e5~mv2.jpg/v1/fill/w_568,h_426,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/220428_3c9c43a08cfb47c89785e9f85938b7e5~mv2.jpg"
          alt="Children learning how to code using an educational programming language, 'Scratch'"
          className="image-sizer"
        />
        <div className="content-text">
          <h2>
            "How can we empower students to see coding as a gateway to
            creativity and innovation?"
          </h2>
          <p>
            At CO;Ders Us, we believe that coding is more than just writing
            lines of code—it's about creativity, collaboration, and
            problem-solving. Our mission is to provide a fun, engaging, and
            interactive environment where students can explore the exciting
            world of coding and technology.
          </p>

          <p>
            <br></br>Through our unique mentoring programs, we bridge the gap
            between traditional education and real-world applications,
            empowering students to not only learn but also innovate. Whether
            it's through Scratch, robotics, or STEAM projects, we aim to make
            coding an accessible and joyful experience for everyone. Let's
            inspire the next generation of creators and problem solvers, one
            code at a time.
          </p>
        </div>
      </section>

      <section className="content-grid-container">
        <div className="content-text">
          <h2>
            "How can we inspire students to explore the endless possibilities of
            coding?"
          </h2>
        </div>

        <div className="grid-container">
          <img
            src="https://images.ctfassets.net/hrltx12pl8hq/5nv31GzvYRRok5rbBfKV0g/a404dbca084276c39fb58341a100c6d6/1_teacher.webp"
            alt="Teachers and students high-fiving each other."
            className="image-sizer"
          />
          <img
            src="https://www.sewu.ac.kr/_res/sewc/childhood/img/main/img-depart-visual01.jpg"
            alt="Kids raising their hands to participate in class."
            className="image-sizer"
          />
          <img
            src="https://cdn.news.unn.net/news/photo/201901/206056_87450_2431.jpg"
            alt="A teacher assisting a child in learning 'Scratch', an educational coding program."
            className="image-sizer"
          />
          <img
            src="https://www.irobotnews.com/news/photo/202304/31454_67751_5010.png"
            alt="Children enthusiastically learning coding with Scratch in a collaborative classroom setting."
            className="image-sizer"
          />
        </div>
      </section>
    </>
  );
};

export default HomeScreen;
