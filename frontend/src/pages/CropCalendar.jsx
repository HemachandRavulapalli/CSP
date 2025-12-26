import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarCheck, FaSeedling, FaWater, FaCut, FaBug, FaSearch } from 'react-icons/fa';
import api from '../services/api';

const CropCalendar = () => {
    const [calendar, setCalendar] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCalendar(selectedCrop);
    }, [selectedCrop]);

    const fetchCalendar = async (crop) => {
        setLoading(true);
        try {
            const response = await api.get(`/calendar/${crop}`);
            setCalendar(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'sowing': case 'planting': return <FaSeedling color="#22c55e" />;
            case 'watering': return <FaWater color="#3b82f6" />;
            case 'harvest': return <FaCut color="#ea580c" />;
            case 'care': return <FaBug color="#eab308" />;
            default: return <FaCalendarCheck color="var(--primary)" />;
        }
    };

    return (
        <motion.div
            className="container"
            style={{ padding: '2rem' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaCalendarCheck color="var(--primary)" /> Growth Calendar
                </h2>

                <div style={{ position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '10px', top: '12px', color: '#888' }} />
                    <select
                        value={selectedCrop}
                        onChange={e => setSelectedCrop(e.target.value)}
                        style={{ padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '2rem', border: '1px solid #ddd', appearance: 'none', minWidth: '200px', cursor: 'pointer' }}
                    >
                        {['Wheat', 'Rice', 'Corn', 'Cotton', 'Sugarcane', 'Tomato', 'Potato', 'Groundnut', 'Chili', 'Onion'].map(crop => (
                            <option key={crop} value={crop}>{crop}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading Timeline...</div>
            ) : calendar.length > 0 ? (
                <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>

                    {/* Central Line */}
                    <div style={{ position: 'absolute', left: '50%', top: '0', bottom: '0', width: '4px', background: '#e5e7eb', transform: 'translateX(-50%)', borderRadius: '4px' }}></div>

                    {calendar.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                display: 'flex',
                                justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start',
                                marginBottom: '2rem',
                                position: 'relative'
                            }}
                        >
                            {/* Dot on Line */}
                            <div style={{
                                position: 'absolute', left: '50%', top: '20px',
                                width: '20px', height: '20px', background: 'var(--primary)',
                                borderRadius: '50%', transform: 'translateX(-50%)', border: '4px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                zIndex: 10
                            }}></div>

                            {/* Content Card */}
                            <div style={{
                                width: '45%',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: index % 2 === 0 ? 'row' : 'row-reverse' // Align text towards center
                            }}>
                                <motion.div
                                    className="glass-card"
                                    whileHover={{ scale: 1.05 }}
                                    style={{
                                        padding: '1.5rem', width: '100%',
                                        borderTop: `4px solid ${item.stage === 'Harvest' ? '#ea580c' : 'var(--primary)'}`
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>Day {item.day_number}</span>
                                        <div style={{ background: '#f3f4f6', padding: '0.5rem', borderRadius: '50%' }}>
                                            {getIcon(item.stage)}
                                        </div>
                                    </div>
                                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{item.task}</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                                        "{item.advice}"
                                    </p>
                                    <div style={{ marginTop: '0.8rem', display: 'inline-block', padding: '2px 8px', borderRadius: '4px', background: '#ecfccb', color: '#3f6212', fontSize: '0.8rem' }}>
                                        {item.stage} Stage
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}

                    {/* End Marker */}
                    <div style={{ textAlign: 'center', marginTop: '2rem', position: 'relative', zIndex: 10 }}>
                        <div style={{ background: '#22c55e', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '2rem', display: 'inline-block', fontWeight: 'bold' }}>
                            Harvest Complete ✅
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                    <FaSeedling size={50} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>Select a crop to see its growth journey.</p>
                </div>
            )}
        </motion.div>
    );
};

export default CropCalendar;
