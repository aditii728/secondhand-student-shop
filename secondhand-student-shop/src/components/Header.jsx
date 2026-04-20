import logo from "../assets/logo.png";

export function Header({ activePage, onNavigate }) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <div className="brand-logo-shell">
          <img className="brand-logo" src={logo} alt="SecondHand Student Shop logo" />
        </div>
        <div>
          <p className="eyebrow">Student marketplace</p>
          <h1 className="brand-name">SecondHand Student Shop</h1>
        </div>
      </div>

      <nav className="topnav" aria-label="Primary navigation">
        <button
          className={`topnav-link ${activePage === "home" ? "topnav-link-active" : ""}`}
          onClick={() => onNavigate("home")}
          type="button"
        >
          Home
        </button>
        <button
          className={`topnav-link ${activePage === "browse" ? "topnav-link-active" : ""}`}
          onClick={() => onNavigate("browse")}
          type="button"
        >
          Browse Listings
        </button>
      </nav>
    </header>
  );
}
