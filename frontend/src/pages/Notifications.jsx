import { useState, useEffect } from 'react';
import api from '../services/api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error(error);
        }
    };

    // Demo: Create a test notification
    const createTestNotification = async () => {
        await api.post('/notifications/create', {
            message: `Weather Alert: Heavy rain expected tomorrow!`,
            type: 'alert'
        });
        fetchNotifications();
    };

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Notifications</h2>
                <button onClick={createTestNotification} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                    + Simulate Alert
                </button>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifications.length === 0 ? (
                    <p>No new notifications.</p>
                ) : (
                    notifications.map(note => (
                        <div key={note.id} className="glass-card" style={{
                            padding: '1rem',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            borderLeft: `4px solid ${note.type === 'alert' ? 'red' : 'blue'}`,
                            opacity: note.is_read ? 0.6 : 1
                        }}>
                            <div>
                                <p style={{ fontWeight: 'bold' }}>{note.message}</p>
                                <small style={{ color: '#666' }}>{new Date(note.created_at).toLocaleString()}</small>
                            </div>
                            {!note.is_read && (
                                <button onClick={() => handleMarkRead(note.id)} style={{ border: 'none', background: 'none', color: 'blue', cursor: 'pointer' }}>
                                    Mark Read
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
