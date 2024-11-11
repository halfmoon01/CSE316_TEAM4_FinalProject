import MainLayout from "@/layouts/MainLayout";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { ROUTES } from "@/constants/route";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {ROUTES.map(({ PATH, ELEMENT }) => (
            <Route key={PATH} path={PATH} element={<ELEMENT />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;