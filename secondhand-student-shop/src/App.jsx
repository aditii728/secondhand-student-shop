import { Route, Routes } from "react-router-dom";
import "./styles/shared.css";
import { Header } from "./components/Header";
import { BrowsePage } from "./pages/BrowsePage";
import { HomePage } from "./pages/HomePage";
import { ROUTES } from "./routes/paths";

function App() {
  return (
    <div className="app-shell" id="top">
      <Header />
      <Routes>
        <Route element={<HomePage />} path={ROUTES.home} />
        <Route element={<BrowsePage />} path={ROUTES.browse} />
      </Routes>
    </div>
  );
}

export default App;
