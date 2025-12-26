import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSeedling, FaCloudSun, FaWater, FaChartLine } from 'react-icons/fa';
import api from '../services/api';

const CropSelection = () => {
    const [formData, setFormData] = useState({ soil_type: 'Loamy', season: 'Kharif' });
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/crops/recommend', formData);
            setRecommendations(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="container"
            style={{ padding: '2rem' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaSeedling color="var(--primary)" /> Smart Crop Selection
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '1.5rem' }}>

                {/* Form */}
                <motion.div
                    className="glass-card"
                    style={{ padding: '2rem' }}
                    initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                >
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaSeedling /> Soil Type
                            </label>
                            <select
                                value={formData.soil_type}
                                onChange={e => setFormData({ ...formData, soil_type: e.target.value })}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                            >
                                <option value="Loamy">Loamy (Balanced)</option>
                                <option value="Clay">Clay (Heavy)</option>
                                <option value="Sandy">Sandy (Light)</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaCloudSun /> Season
                            </label>
                            <select
                                value={formData.season}
                                onChange={e => setFormData({ ...formData, season: e.target.value })}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                            >
                                <option value="Kharif">Kharif (Monsoon)</option>
                                <option value="Rabi">Rabi (Winter)</option>
                                <option value="Zaid">Zaid (Summer)</option>
                            </select>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                        >
                            {loading ? 'Analyzing...' : 'Get Recommendations'}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Results */}
                <div>
                    {recommendations.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}
                        >
                            {recommendations.map((crop, index) => (
                                <motion.div
                                    key={index}
                                    className="glass-card"
                                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.1 }}
                                    style={{ padding: '1.5rem', borderTop: '4px solid var(--primary)', textAlign: 'center' }}
                                >
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{crop.name}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.9rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#0369a1' }}>
                                            <FaWater /> {crop.water}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#15803d' }}>
                                            <FaChartLine /> {crop.demand}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CropSelection;
