import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { ROUTES } from "../routes/paths";
import "../styles/header.css";

export function Header() {
  return (
    <header className="topbar">
      <Link className="brand-lockup" to={ROUTES.home}>
        <div className="brand-logo-shell">
          <img className="brand-logo" src={logo} alt="SecondHand Student Shop logo" />
        </div>
        <div>
          <p className="eyebrow">Student marketplace</p>
          <h1 className="brand-name">SecondHand Student Shop</h1>
        </div>
      </Link>

      <nav className="topnav" aria-label="Primary navigation">
        <NavLink
          className={({ isActive }) =>
            `topnav-link ${isActive ? "topnav-link-active" : ""}`
          }
          end
          to={ROUTES.home}
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `topnav-link ${isActive ? "topnav-link-active" : ""}`
          }
          to={ROUTES.browse}
        >
          Browse Listings
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `topnav-link topnav-link-cta ${isActive ? "topnav-link-active" : ""}`
          }
          to={ROUTES.login}
        >
          Log In
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `topnav-link topnav-link-cta ${isActive ? "topnav-link-active" : ""}`
          }
          to={ROUTES.signup}
        >
          Sign Up
        </NavLink>
      </nav>
    </header>
  );
}
