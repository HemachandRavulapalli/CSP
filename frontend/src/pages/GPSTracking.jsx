import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import { FaTruck, FaMapMarkerAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import api from '../services/api';

// Fix for Leaflet marker icons
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const GPSTracking = () => {
    const { orderId } = useParams();
    const [position, setPosition] = useState([40.7128, -74.0060]);
    const [status, setStatus] = useState('In Transit');

    useEffect(() => {
        // In real app, poll every few seconds
        const fetchTracking = async () => {
            try {
                const response = await api.get(`/gps/track/${orderId}`);
                if (response.data && response.data.latitude) {
                    setPosition([parseFloat(response.data.latitude), parseFloat(response.data.longitude)]);
                }
            } catch (err) {
                console.error('Error fetching GPS', err);
            }
        };
        fetchTracking();
        const interval = setInterval(fetchTracking, 5000);
        return () => clearInterval(interval);
    }, [orderId]);

    return (
        <motion.div
            className="container"
            style={{ padding: '2rem', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2><FaTruck style={{ marginRight: '10px', color: 'var(--primary)' }} /> Shipment Tracking</h2>
                <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 'bold' }}>
                    Order #{orderId}
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem', flex: 1 }}>

                {/* Map Section */}
                <motion.div
                    className="glass-card"
                    style={{ padding: '0.5rem', overflow: 'hidden', height: '100%', minHeight: '400px' }}
                    initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                >
                    <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%', borderRadius: '1rem' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                            <Popup>
                                <div style={{ textAlign: 'center' }}>
                                    <strong>Order #{orderId}</strong><br />
                                    🚚 {status}
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </motion.div>

                {/* Timeline Section */}
                <motion.div
                    className="glass-card"
                    style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}
                    initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                >
                    <h3 style={{ marginBottom: '1.5rem' }}>Delivery Status</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                        {/* Vertical Line */}
                        <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '10px', width: '2px', background: '#e5e7eb', zIndex: 0 }}></div>

                        <TimelineItem
                            icon={<FaCheckCircle color="#22c55e" />}
                            title="Order Placed"
                            time="10:00 AM"
                            active
                        />
                        <TimelineItem
                            icon={<FaCheckCircle color="#22c55e" />}
                            title="Packed"
                            time="11:30 AM"
                            active
                        />
                        <TimelineItem
                            icon={<FaTruck color="#3b82f6" />}
                            title="In Transit"
                            time="01:15 PM"
                            active
                        />
                        <TimelineItem
                            icon={<FaMapMarkerAlt color="#9ca3af" />}
                            title="Delivered"
                            time="--:--"
                        />
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Estimated Arrival</p>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>04:30 PM</div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const TimelineItem = ({ icon, title, time, active }) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'white', padding: '4px' }}>
            {icon}
        </div>
        <div>
            <div style={{ fontWeight: active ? 'bold' : 'normal', color: active ? 'black' : '#999' }}>{title}</div>
            <div style={{ fontSize: '0.8rem', color: '#999' }}>{time}</div>
        </div>
    </div>
);

export default GPSTracking;
