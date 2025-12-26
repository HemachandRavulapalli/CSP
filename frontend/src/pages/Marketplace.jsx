import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaShoppingCart, FaMapMarkerAlt, FaTag } from 'react-icons/fa';
import api from '../services/api';

const Marketplace = () => {
    const [crops, setCrops] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newCrop, setNewCrop] = useState({
        crop_name: '', price: '', quantity: '', description: ''
    });

    useEffect(() => {
        fetchCrops();
    }, []);

    const fetchCrops = async () => {
        try {
            const response = await api.get('/marketplace');
            setCrops(response.data);
        } catch (error) {
            console.error('Error fetching marketplace items', error);
        }
    };

    const handleAddCrop = async (e) => {
        e.preventDefault();
        try {
            await api.post('/marketplace/add', newCrop);
            setShowModal(false);
            fetchCrops();
            alert('Crop listed successfully!');
        } catch (error) {
            alert('Failed to list crop');
        }
    };

    const handleBuy = async (listingId) => {
        try {
            // In a real app, this would open a payment gateway
            const response = await api.post('/marketplace/buy', { listing_id: listingId, quantity: 1 });
            alert(`Order Placed! Use Order ID #${response.data.orderId} for tracking.`);
            window.location.href = `/track/${response.data.orderId}`;
        } catch (error) {
            alert('Purchase failed');
        }
    };

    return (
        <motion.div
            className="container"
            style={{ padding: '2rem' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Marketplace</h2>
                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaPlus /> Sell Crop
                </motion.button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {crops.length === 0 ? (
                    <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888' }}>Marketplace is empty. Be the first to sell!</p>
                ) : (
                    crops.map((crop, index) => (
                        <motion.div
                            key={crop.id}
                            className="glass-card"
                            style={{ padding: '0', overflow: 'hidden' }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                        >
                            <div style={{ height: '150px', background: 'linear-gradient(to right, #a8e063, #56ab2f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>{crop.crop_name[0]}</span>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0' }}>{crop.crop_name}</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>{crop.description}</p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                        <FaTag /> ₹{crop.price}/kg
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#888', fontSize: '0.9rem' }}>
                                        <FaMapMarkerAlt /> {crop.quantity}kg
                                    </div>
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    className="btn btn-secondary"
                                    style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                                    onClick={() => handleBuy(crop.id)}
                                >
                                    <FaShoppingCart /> Buy Now
                                </motion.button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, backdropFilter: 'blur(5px)'
                }}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="glass-card"
                        style={{ padding: '2rem', width: '90%', maxWidth: '500px', background: 'white' }}
                    >
                        <h3>Sell Your Crop</h3>
                        <form onSubmit={handleAddCrop} style={{ marginTop: '1rem' }}>
                            <input className="mb-2" placeholder="Crop Name (e.g. Tomato)" value={newCrop.crop_name} onChange={e => setNewCrop({ ...newCrop, crop_name: e.target.value })} required style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }} />
                            <input className="mb-2" placeholder="Price per kg" type="number" value={newCrop.price} onChange={e => setNewCrop({ ...newCrop, price: e.target.value })} required style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }} />
                            <input className="mb-2" placeholder="Quantity (kg)" type="number" value={newCrop.quantity} onChange={e => setNewCrop({ ...newCrop, quantity: e.target.value })} required style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }} />
                            <textarea className="mb-2" placeholder="Description" value={newCrop.description} onChange={e => setNewCrop({ ...newCrop, description: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}></textarea>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>List Crop</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default Marketplace;
