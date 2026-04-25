import { Route, Routes } from "react-router-dom";
import "./styles/shared.css";
import { Header } from "./components/Header";
import { BrowsePage } from "./pages/BrowsePage";
import { HomePage } from "./pages/HomePage";
import { ItemDetailsPage } from "./pages/ItemDetailsPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ROUTES } from "./routes/paths";

function App() {
  return (
    <div className="app-shell" id="top">
      <Header />
      <Routes>
        <Route element={<HomePage />} path={ROUTES.home} />
        <Route element={<BrowsePage />} path={ROUTES.browse} />
        <Route element={<LoginPage />} path={ROUTES.login} />
        <Route element={<SignupPage />} path={ROUTES.signup} />
        <Route element={<ItemDetailsPage />} path={ROUTES.itemDetails} />
      </Routes>
    </div>
  );
}

export default App;
