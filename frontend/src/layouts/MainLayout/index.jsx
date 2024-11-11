import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
  return (
    <div
      style={{
        backgroundColor: "#FAF7F0",
        width: "100%",
        minHeight: "100vh",
        color: "#4A4947",
      }}
    >
      <Header />
      <main
        style={{
          backgroundColor: "#FAF7F0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100vw",
          color: "#4A4947",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
