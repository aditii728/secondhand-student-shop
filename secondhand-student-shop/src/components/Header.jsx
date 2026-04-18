import logo from "../assets/logo.png";

export function Header({ links }) {
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
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
