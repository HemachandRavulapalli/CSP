import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaLock, FaUser, FaUserTag } from 'react-icons/fa';
import api from '../services/api';

const Login = () => {
  const [step, setStep] = useState(1);
  const [isRegistering, setIsRegistering] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('farmer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/send-otp', { phone });
      setStep(2);
      setError('');
      alert('OTP sent: 1234');
    } catch (err) {
      setError('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const payload = { phone, otp };
      if (isRegistering) {
        payload.name = name;
        payload.role = role;
      }
      const response = await api.post('/auth/verify-otp', payload);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="glass-card"
        style={{ padding: '2.5rem', width: '100%', maxWidth: '450px', position: 'relative' }}
      >
        <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '0.5rem', borderRadius: '20%', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '15%' }} />
        </div>

        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center', marginTop: '1rem' }}>
          {step === 2 ? 'Verify OTP' : (isRegistering ? 'Join SmartAgri' : 'Welcome Back')}
        </h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
          {step === 2 ? 'Enter the code sent to your mobile' : (isRegistering ? 'Create an account to start farming smarter' : 'Login to manage your farm')}
        </p>

        {error && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', background: '#fee2e2', padding: '0.5rem', borderRadius: '4px' }}>{error}</motion.div>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            {isRegistering && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                  <FaUser style={{ position: 'absolute', top: '12px', left: '10px', color: '#888' }} />
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required style={{ paddingLeft: '2.5rem', width: '100%' }} />
                </div>

                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                  <FaUserTag style={{ position: 'absolute', top: '12px', left: '10px', color: '#888' }} />
                  <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', paddingLeft: '2.5rem', borderRadius: '0.5rem', padding: '0.8rem 0.8rem 0.8rem 2.5rem' }}>
                    <option value="farmer">Farmer</option>
                    <option value="consumer">Consumer</option>
                  </select>
                </div>
              </motion.div>
            )}

            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <FaPhoneAlt style={{ position: 'absolute', top: '12px', left: '10px', color: '#888' }} />
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" required style={{ paddingLeft: '2.5rem', width: '100%' }} />
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {isRegistering ? 'Send OTP' : 'Login'}
            </motion.button>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
              <a onClick={() => setIsRegistering(!isRegistering)} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>
                {isRegistering ? 'Already have an account? Login' : 'New User? Register Here'}
              </a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              Sent to <strong>{phone}</strong> <small style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setStep(1)}>(Edit)</small>
            </p>

            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <FaLock style={{ position: 'absolute', top: '12px', left: '10px', color: '#888' }} />
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 4-digit OTP" required style={{ paddingLeft: '2.5rem', width: '100%', letterSpacing: '2px', fontWeight: 'bold' }} />
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Verify & Proceed
            </motion.button>
            <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ width: '100%', marginTop: '0.8rem' }}>Back</button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
