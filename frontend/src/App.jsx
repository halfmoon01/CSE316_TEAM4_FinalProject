import "./App.css";
import Router from "@/shared/Router";
import { AuthTracker } from "./AuthTracker";

const App = () => {
  return (
    <AuthTracker>
      <Router />
    </AuthTracker>
  );
};

export default App;