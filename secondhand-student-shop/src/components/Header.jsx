import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.png";
import { ROUTES } from "../routes/paths";
import "../styles/header.css";

function getInitials(user) {
  const source = user.full_name?.trim() || user.username;
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function Header() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate(ROUTES.home);
  }

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

        {isAuthenticated ? (
          <>
            <NavLink
              className={({ isActive }) =>
                `topnav-link ${isActive ? "topnav-link-active" : ""}`
              }
              to={ROUTES.listItem}
            >
              List Item
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `topnav-link ${isActive ? "topnav-link-active" : ""}`
              }
              to={ROUTES.myItems}
            >
              My Items
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `topnav-link topnav-link-cta ${isActive ? "topnav-link-active" : ""}`
              }
              to={ROUTES.profile}
            >
              <span className="topnav-avatar" aria-hidden="true">
                {getInitials(currentUser)}
              </span>
              <span>{currentUser.full_name || currentUser.username}</span>
            </NavLink>
            <button className="topnav-link topnav-link-cta topnav-link-button" onClick={handleLogout} type="button">
              Log Out
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
      </nav>
    </header>
  );
}
