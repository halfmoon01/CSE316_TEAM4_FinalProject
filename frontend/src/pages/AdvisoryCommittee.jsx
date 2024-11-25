import { useEffect } from "react";
import "@/css_files/advisoryCommittee.css";

const AdvisoryCommittee = () => {
  useEffect(() => {
    document.title = "Advisory Committee Page";
  }, []);

  return (
    <div className="advisory-board">
      <h2>Advisory Board</h2>
      <hr/>
      <ol>
        <li>
          A person who has been active in the Coding Education Academic Association for more than 5 years and has held an executive position
        </li>
        <li>
          A person who has served as an executive in a relevant organization or public institution, or has held a rank of grade 4 or higher in the relevant field
        </li>
        <li>
          A person who has served as a research committee member or higher in a relevant research institution
        </li>
        <li>
          A person who holds a position of assistant professor or higher at a university in the relevant field
        </li>
        <li>
          A person who has obtained a master's degree or higher in the relevant field
        </li>
        <li>
          A person who has 4 or more years of research or practical experience in the relevant field
        </li>
        <li>
          A person who has obtained a teaching qualification or is recognized for having extensive knowledge in the field of education
        </li>
        <li>
          A person who is recognized for having extensive knowledge in software development, hardware development, or computer science
        </li>
        <li>
          Any other person recognized by the executive board as having professional knowledge and practical experience in the relevant field
        </li>
      </ol>
    </div>
  );
};

export default AdvisoryCommittee;