import { Route, Routes } from "react-router-dom";
import "./styles/shared.css";
import { Header } from "./components/Header";
import { BrowsePage } from "./pages/BrowsePage";
import { HomePage } from "./pages/HomePage";
import { ItemDetailsPage } from "./pages/ItemDetailsPage";
import { SellPage } from "./pages/SellPage";
import { ROUTES } from "./routes/paths";

function App() {
  return (
    <div className="app-shell" id="top">
      <Header />
      <Routes>
        <Route element={<HomePage />} path={ROUTES.home} />
        <Route element={<BrowsePage />} path={ROUTES.browse} />
        <Route element={<ItemDetailsPage />} path={ROUTES.itemDetails} />
        <Route element={<SellPage />} path={ROUTES.sell} />
      </Routes>
    </div>
  );
}

export default App;