import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserEdit, FaMapMarkedAlt, FaLeaf } from 'react-icons/fa';
import api from '../services/api';

const Profile = () => {
    const [profile, setProfile] = useState({
        name: '', phone_number: '', address: '', farm_location: '', soil_type: 'Loamy', farm_size: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile');
                const { name, phone_number, profile } = response.data;
                setProfile({
                    name, phone_number,
                    address: profile.address || '',
                    farm_location: profile.farm_location || '',
                    soil_type: profile.soil_type || 'Loamy',
                    farm_size: profile.farm_size || ''
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/profile', profile);
            alert('Profile updated successfully!');
        } catch (err) {
            alert('Failed to update profile');
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const loc = `${position.coords.latitude}, ${position.coords.longitude}`;
                setProfile({ ...profile, farm_location: loc });
            }, (error) => {
                alert('Error getting location: ' + error.message);
            });
        }
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <motion.div
            className="container"
            style={{ padding: '2rem' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
            <h2>My Profile</h2>
            <motion.div
                className="glass-card"
                style={{ padding: '2rem', maxWidth: '600px', margin: '1.5rem auto' }}
                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '80px', height: '80px', background: '#ccc', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                        {profile.name[0]}
                    </div>
                    <h3 style={{ marginTop: '1rem' }}>{profile.name}</h3>
                    <p style={{ color: '#666' }}>{profile.phone_number}</p>
                </div>

                <form onSubmit={handleUpdate}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Address</label>
                        <textarea
                            value={profile.address}
                            onChange={e => setProfile({ ...profile, address: e.target.value })}
                            placeholder="Village, District, State"
                            rows="2"
                            style={{ padding: '0.8rem' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaMapMarkedAlt /> Farm Location (GPS)
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                value={profile.farm_location}
                                onChange={e => setProfile({ ...profile, farm_location: e.target.value })}
                                placeholder="17.3850, 78.4867"
                                style={{ padding: '0.8rem' }}
                            />
                            <button type="button" className="btn btn-secondary" onClick={getLocation} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                📍 Detect
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaLeaf /> Soil Type
                        </label>
                        <select
                            value={profile.soil_type}
                            onChange={e => setProfile({ ...profile, soil_type: e.target.value })}
                            style={{ padding: '0.8rem', width: '100%', borderRadius: '0.5rem', border: '1px solid #ddd' }}
                        >
                            <option value="Loamy">Loamy</option>
                            <option value="Clay">Clay</option>
                            <option value="Sandy">Sandy</option>
                            <option value="Silt">Silt</option>
                            <option value="Black Soil">Black Soil</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Farm Size (Acres)</label>
                        <input
                            value={profile.farm_size}
                            onChange={e => setProfile({ ...profile, farm_size: e.target.value })}
                            placeholder="e.g. 5"
                            style={{ padding: '0.8rem' }}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', fontSize: '1.1rem' }}
                    >
                        <FaUserEdit /> Update Profile
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Profile;
