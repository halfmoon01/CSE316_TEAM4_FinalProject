import { useEffect } from "react";

const NotFound = () => {

  useEffect(() => {
    document.title = 'Page Not Found';
  }, []);


  return <h1>404: Page Not Found</h1>;
};

export default NotFound;