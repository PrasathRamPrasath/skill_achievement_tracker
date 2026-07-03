import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/dashboard',      label: 'Dashboard' },
  { to: '/profile',        label: 'Profile' },
  { to: '/certifications', label: 'Certifications' },
  { to: '/achievements',   label: 'Achievements' },
  { to: '/internships',    label: 'Internships' },
  { to: '/activities',     label: 'Activities' },
  { to: '/ai-advisor',     label: '✦ AI Advisor', ai: true },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'ST';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/dashboard" className="navbar-brand">
          <span className="navbar-logo">ST</span>
          <span className="navbar-title">Skills Tracker</span>
        </Link>

        {/* Navigation links */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={[
                'navbar-link',
                link.ai ? 'navbar-link-ai' : '',
                location.pathname === link.to ? 'navbar-link-active' : '',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User + Logout */}
        <div className="navbar-user">
          <div className="navbar-avatar">{initials}</div>
          <span className="navbar-user-name">{user?.name}</span>
          <button onClick={handleLogout} className="navbar-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
