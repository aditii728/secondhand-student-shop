import { Route, Routes, useLocation } from "react-router-dom";
import "./styles/shared.css";
import { Header } from "./components/Header";
import { AuthProvider } from "./context/AuthContext";
import { BrowsePage } from "./pages/BrowsePage";
import { HomePage } from "./pages/HomePage";
import { ItemDetailsPage } from "./pages/ItemDetailsPage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SignupPage } from "./pages/SignupPage";
import { ROUTES } from "./routes/paths";

function App() {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === ROUTES.login || location.pathname === ROUTES.signup;

  return (
    <AuthProvider>
      <div className={`app-shell ${isAuthRoute ? "app-shell-auth" : ""}`} id="top">
        <Header />
        <Routes>
          <Route element={<HomePage />} path={ROUTES.home} />
          <Route element={<BrowsePage />} path={ROUTES.browse} />
          <Route element={<LoginPage />} path={ROUTES.login} />
          <Route element={<SignupPage />} path={ROUTES.signup} />
          <Route element={<ProfilePage />} path={ROUTES.profile} />
          <Route element={<ItemDetailsPage />} path={ROUTES.itemDetails} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
