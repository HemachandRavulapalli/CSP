import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf } from 'react-icons/fa';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <motion.nav
            className="navbar"
            initial={{ y: -50 }} animate={{ y: 0 }}
            style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                position: 'sticky', top: 0, zIndex: 1000,
                borderBottom: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}
        >
            <div className="container nav-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', padding: '0 2rem' }}>
                <Link to="/" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>
                    <img src="/logo.png" alt="SmartAgri" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                    SmartAgri
                </Link>
                <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <NavLink to="/marketplace">Marketplace</NavLink>

                            {user.role === 'farmer' && (
                                <>
                                    <NavLink to="/calendar">Calendar</NavLink>
                                    <NavLink to="/crop-selection">Crops</NavLink>
                                    <NavLink to="/recommendations">Advice</NavLink>
                                </>
                            )}

                            <NavLink to="/notifications">🔔</NavLink>
                            <NavLink to="/profile">Profile</NavLink>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={handleLogout}
                                className="btn btn-secondary"
                                style={{ padding: '0.5rem 1.2rem', borderRadius: '2rem', border: '1px solid #166534', color: '#166534', background: 'transparent' }}
                            >
                                Logout
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login">Login</NavLink>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none', padding: '0.6rem 1.5rem', borderRadius: '2rem' }}>
                                    Get Started
                                </Link>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

const NavLink = ({ to, children }) => (
    <Link to={to} style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500', fontSize: '1rem', transition: 'color 0.2s' }}
        onMouseEnter={(e) => e.target.style.color = '#166534'}
        onMouseLeave={(e) => e.target.style.color = '#4b5563'}>
        {children}
    </Link>
);

export default Navbar;
