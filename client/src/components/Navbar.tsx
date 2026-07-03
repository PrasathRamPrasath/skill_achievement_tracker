import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentLinks = [
  { to: '/dashboard',      label: 'Dashboard' },
  { to: '/profile',        label: 'Profile' },
  { to: '/certifications', label: 'Certifications' },
  { to: '/achievements',   label: 'Achievements' },
  { to: '/internships',    label: 'Internships' },
  { to: '/projects',       label: 'Projects' },
  { to: '/activities',     label: 'Activities' },
  { to: '/timeline',       label: 'Timeline' },
  { to: '/ai-advisor',     label: '✦ AI Advisor', ai: true },
];

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/admin',     label: 'Admin', admin: true },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';
  const navLinks = isAdmin ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
                (link as any).ai    ? 'navbar-link-ai'    : '',
                (link as any).admin ? 'navbar-link-admin' : '',
                location.pathname === link.to ? 'navbar-link-active' : '',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User + Logout */}
        <div className="navbar-user">
          <div className="navbar-avatar" style={isAdmin ? { background: 'linear-gradient(135deg, #dc2626, #991b1b)' } : {}}>
            {initials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span className="navbar-user-name">{user?.name}</span>
            <span style={{
              fontSize: 10, fontWeight: 700,
              color: isAdmin ? '#dc2626' : '#059669',
            }}>
              {isAdmin ? '🏫 ADMIN' : '🎓 STUDENT'}
            </span>
          </div>
          <button onClick={handleLogout} className="navbar-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
