import { useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { BrowsePage } from "./pages/BrowsePage";
import { HomePage } from "./pages/HomePage";

function App() {
  const [activePage, setActivePage] = useState("home");

  return (
    <div className="app-shell" id="top">
      <Header activePage={activePage} onNavigate={setActivePage} />
      {activePage === "home" ? (
        <HomePage onBrowse={() => setActivePage("browse")} />
      ) : (
        <BrowsePage />
      )}
    </div>
  );
}

export default App;
