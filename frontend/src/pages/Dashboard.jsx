import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WiDaySunny, WiCloudy } from 'react-icons/wi';
import { FaTractor, FaLeaf, FaShoppingCart, FaCalendarAlt, FaBell, FaBoxOpen } from 'react-icons/fa';

const Dashboard = () => {
    const [user, setUser] = useState({});
    const [weather, setWeather] = useState({ temp: 28, condition: 'Sunny', humidity: 65, wind: 12 });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser || {});
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const isFarmer = user.role?.toLowerCase() === 'farmer';

    return (
        <motion.div
            className="container"
            style={{ padding: '2rem' }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h2 variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
                Welcome, <span style={{ color: 'var(--primary)' }}>{user.name || (isFarmer ? 'Farmer' : 'Consumer')}</span>! 👋
            </motion.h2>

            {/* Weather Widget (Everyone sees weather, useful for delivery too) */}
            <motion.div variants={itemVariants} className="glass-card" style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                color: 'white',
                marginBottom: '2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2rem'
            }}>
                <div>
                    <h3>Local Weather</h3>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <WiDaySunny /> {weather.temp}°C
                    </div>
                    <p>{weather.condition} • Humidity: {weather.humidity}%</p>
                </div>
                <WiCloudy size={100} style={{ opacity: 0.8 }} />
            </motion.div>

            {/* Quick Actions Grid */}
            <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>

                {/* Farmer Actions */}
                {isFarmer && (
                    <>
                        <ActionCard icon={<FaLeaf size={30} color="#16a34a" />} title="My Crops" link="/crop-selection" />
                        <ActionCard icon={<FaCalendarAlt size={30} color="#ea580c" />} title="Calendar" link="/calendar" />
                    </>
                )}

                {/* Consumer Actions (Order Status) */}
                {!isFarmer && (
                    <ActionCard icon={<FaBoxOpen size={30} color="#8b5cf6" />} title="My Orders" link="/notifications" />
                )}

                {/* Common Actions */}
                <ActionCard icon={<FaShoppingCart size={30} color="#2563eb" />} title="Marketplace" link="/marketplace" />
                <ActionCard icon={<FaBell size={30} color="#d97706" />} title="Alerts" link="/notifications" />
            </div>

            {/* Daily Tip (Farmer Only) */}
            {isFarmer && (
                <motion.div variants={itemVariants} className="glass-card" style={{ marginTop: '2rem', borderLeft: '5px solid var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <FaTractor size={24} color="var(--primary)" />
                        <h4>Daily Farming Tip</h4>
                    </div>
                    <p style={{ fontStyle: 'italic', color: '#555' }}>
                        "Check for early signs of pest on cotton crops today."
                    </p>
                </motion.div>
            )}

            {/* Consumer Info */}
            {!isFarmer && (
                <motion.div variants={itemVariants} className="glass-card" style={{ marginTop: '2rem', borderLeft: '5px solid #8b5cf6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <FaShoppingCart size={24} color="#8b5cf6" />
                        <h4>Fresh from Farm</h4>
                    </div>
                    <p style={{ color: '#555' }}>
                        Browse the marketplace to find fresh, organic produce directly from local farmers.
                    </p>
                </motion.div>
            )}

        </motion.div>
    );
};

const ActionCard = ({ icon, title, link }) => (
    <motion.div
        variants={{ hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.05, translateY: -5 }}
        whileTap={{ scale: 0.95 }}
        className="glass-card"
        style={{ padding: '0', overflow: 'hidden' }}
    >
        <Link
            to={link}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '2rem', textDecoration: 'none', color: '#333', cursor: 'pointer',
                width: '100%', height: '100%'
            }}
        >
            <div style={{ marginBottom: '1rem', background: '#f3f4f6', padding: '1rem', borderRadius: '50%' }}>
                {icon}
            </div>
            <span style={{ fontWeight: 'bold' }}>{title}</span>
        </Link>
    </motion.div>
);

export default Dashboard;
