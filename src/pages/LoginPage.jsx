import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (userId) => {
        login(userId);
        navigate('/dashboard');
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.logo}>
                    <Activity size={48} color="#00e5ff" />
                    <h1 style={styles.title}>PhysioFlow</h1>
                </div>
                <p style={styles.subtitle}>AI-Powered Physiotherapy Assistant</p>

                <div style={styles.card}>
                    <h2 style={{ marginTop: 0 }}>Select a Demo Profile</h2>
                    <div style={styles.buttonGroup}>
                        <button style={styles.btn} onClick={() => handleLogin('user_new')}>
                            <div style={styles.avatar}>RK</div>
                            <div>
                                <strong>Rahul Kumar (New)</strong>
                                <div style={styles.subtext}>No history, needs PT</div>
                            </div>
                        </button>
                        <button style={styles.btn} onClick={() => handleLogin('user_rehab')}>
                            <div style={{ ...styles.avatar, background: '#4cd964' }}>PT</div>
                            <div>
                                <strong>Priya Sharma (Rehab)</strong>
                                <div style={styles.subtext}>Has active report</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0e0e10',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
    },
    content: {
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '10px'
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '800',
        background: 'linear-gradient(45deg, #00e5ff, #2979ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: 0
    },
    subtitle: {
        color: '#888',
        marginBottom: '40px'
    },
    card: {
        backgroundColor: '#1c1c1e',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    },
    buttonGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    btn: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        backgroundColor: '#2c2c2e',
        border: '1px solid #444',
        borderRadius: '12px',
        color: 'white',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.2s',
        ':hover': {
            backgroundColor: '#333'
        }
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#00e5ff',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '0.8rem'
    },
    subtext: {
        fontSize: '0.8rem',
        color: '#aaa',
        fontWeight: 'normal'
    }
};

export default LoginPage;
