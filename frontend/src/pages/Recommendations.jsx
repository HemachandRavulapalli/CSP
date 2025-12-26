import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCloudSun, FaTint, FaWind, FaSeedling, FaBug, FaExclamationTriangle } from 'react-icons/fa';
import api from '../services/api';

const Recommendations = () => {
    const [weather, setWeather] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating API fetch for weather/recommendations
        // In real app, api.get('/recommendations') would utilize backend logic
        setTimeout(() => {
            setWeather({
                temp: 29,
                condition: 'Partly Cloudy',
                humidity: 70,
                wind: 15,
                icon: <FaCloudSun size={60} color="#f59e0b" />
            });
            setRecommendations([
                { type: 'water', text: 'Soil moisture is low. Irrigate crops late evening.', icon: <FaTint color="#3b82f6" /> },
                { type: 'disease', text: 'High humidity may causing fungal growth. Check leaves.', icon: <FaBug color="#ef4444" /> },
                { type: 'nutrient', text: 'Cotton crops enter flowering stage. Apply Potassium.', icon: <FaSeedling color="#22c55e" /> },
                { type: 'alert', text: 'Strong winds expected tomorrow. Secure tall crops.', icon: <FaWind color="#64748b" /> }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Analyzing Environment...</div>;

    return (
        <motion.div
            className="container"
            style={{ padding: '2rem' }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div style={{ marginBottom: '2rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaExclamationTriangle color="var(--primary)" /> Smart Advisory
                </h2>
                <p style={{ color: '#666' }}>Real-time suggestions based on your local weather and crop stage.</p>
            </motion.div>

            {/* Weather Header */}
            <motion.div
                className="glass-card"
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                style={{
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                    color: 'white', padding: '2rem', marginBottom: '2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}
            >
                <div>
                    <h3 style={{ opacity: 0.9 }}>Current Conditions</h3>
                    <div style={{ fontSize: '3.5rem', fontWeight: 'bold' }}>{weather.temp}°C</div>
                    <div style={{ fontSize: '1.2rem', opacity: 0.9 }}>{weather.condition}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    {weather.icon}
                    <div style={{ marginTop: '0.5rem' }}>Humidity: {weather.humidity}%</div>
                    <div>Wind: {weather.wind} km/h</div>
                </div>
            </motion.div>

            {/* Recommendations Grid */}
            <h3 style={{ marginBottom: '1rem' }}>Action Items</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {recommendations.map((rec, index) => (
                    <motion.div
                        key={index}
                        className="glass-card"
                        variants={{ hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
                        whileHover={{ scale: 1.03 }}
                        style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', borderLeft: `5px solid ${rec.type === 'alert' ? '#ef4444' : 'var(--primary)'}` }}
                    >
                        <div style={{ background: '#f3f4f6', padding: '0.8rem', borderRadius: '50%', fontSize: '1.5rem' }}>
                            {rec.icon}
                        </div>
                        <div>
                            <h4 style={{ textTransform: 'capitalize', marginBottom: '0.3rem' }}>{rec.type} Advisory</h4>
                            <p style={{ color: '#555', lineHeight: '1.5' }}>{rec.text}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Recommendations;
