import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import { useAuth } from "../hooks/useAuth"; 

function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu  = () => setMenuOpen(false);

  // Our user object has firstName + lastName from /api/auth/me
  const displayName = user?.firstName
    || user?.email?.split("@")[0]
    || "Account";

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await logout();
      navigate("/");
    } catch (e) {
      console.error(e);
    } finally {
      setSigningOut(false);
      closeMenu();
    }
  }

  return (
    <header>
      <nav className="navbar">
        <div className="nav-header">
          <Link to="/" onClick={closeMenu}>
            <img src="/images/logo2.png" alt="Sakinah Logo" />
          </Link>
          <button className="hamburger" onClick={toggleMenu}>☰</button>
        </div>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>

          <li>
            <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          </li>

          <li>
            <NavLink to="/masajidtimings" onClick={closeMenu}>
              Masajid Timings
            </NavLink>
          </li>

          <li>
            <NavLink to="/hijri-calendar" onClick={closeMenu}>
              Hijri Calendar
            </NavLink>
          </li>

          <li className="dropdown">
            <NavLink to="/calculations" onClick={closeMenu}>
              Calculations
            </NavLink>
            <ul className="dropdown-menu">
              <li><NavLink to="/calculations/zakat"       onClick={closeMenu}>Zakat</NavLink></li>
              <li><NavLink to="/calculations/fitrah"      onClick={closeMenu}>Fitrah</NavLink></li>
              <li><NavLink to="/calculations/inheritence" onClick={closeMenu}>Inheritence</NavLink></li>
              <li><NavLink to="/calculations/iddat"       onClick={closeMenu}>Iddat</NavLink></li>
              <li><NavLink to="/calculations/aqiqah"      onClick={closeMenu}>Aqiqah</NavLink></li>
            </ul>
          </li>

          <li>
            <NavLink to="/aboutus" onClick={closeMenu}>About Us</NavLink>
          </li>

          {/* ── Auth-aware links ───────────────────────── */}
          {isLoggedIn ? (
            <>
              <li>
                <NavLink to="/calendar" onClick={closeMenu}>
                  My Calendar
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" onClick={closeMenu}>
                  Dashboard
                </NavLink>
              </li>
              <li className="dropdown">
                <span className="nav-user-name">👤 {displayName}</span>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink to="/profile" onClick={closeMenu}>
                      My Profile
                    </NavLink>
                  </li>
                  <li>
                    <button
                      className="nav-signout-btn"
                      onClick={handleSignOut}
                      disabled={signingOut}
                    >
                      {signingOut ? "Signing out..." : "Sign out"}
                    </button>
                  </li>
                </ul>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" onClick={closeMenu} className="nav-login-btn">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup" onClick={closeMenu} className="nav-signup-btn">
                  Sign Up
                </NavLink>
              </li>
            </>
          )}

        </ul>
      </nav>
    </header>
  );
}

export default Navbar;