import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogIn, User, Lock } from 'lucide-react';
import Footer from '../components/Footer';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const res = login(username, password);
        if (res.success) {
            // Redirect based on role
            if (res.role === 'physio') {
                navigate('/pt-dashboard');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(res.message);
        }
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
                    <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Welcome Back</h2>

                    {error && <div style={styles.error}>{error}</div>}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <User size={20} color="#666" />
                            <input
                                type="text"
                                placeholder="Username (e.g. user_rehab)"
                                style={styles.input}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <Lock size={20} color="#666" />
                            <input
                                type="password"
                                placeholder="Password"
                                style={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" style={styles.btn}>
                            Login <LogIn size={18} />
                        </button>
                    </form>

                    <div style={styles.divider}>
                        <span>or try demo accounts</span>
                    </div>

                    <div style={styles.demoLinks}>
                        <button onClick={() => { setUsername('user_rehab'); setPassword('demo'); }} style={styles.demoBtn}>Priya (Patient)</button>
                        <button onClick={() => { setUsername('dr_anjali'); setPassword('password'); }} style={{ ...styles.demoBtn, borderColor: '#00e5ff', color: '#00e5ff' }}>Dr. Anjali (Physio)</button>
                    </div>

                    <div style={styles.footerLink}>
                        Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden', // Prevent horizontal scroll
        backgroundColor: '#0e0e10',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
    },
    content: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '400px',
        padding: '20px'
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
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        width: '100%'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#2c2c2e',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid #444'
    },
    input: {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '1rem',
        outline: 'none',
        width: '100%'
    },
    btn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '14px',
        backgroundColor: '#00e5ff',
        color: '#000',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px'
    },
    error: {
        color: '#ff3b30',
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '15px',
        fontSize: '0.9rem',
        textAlign: 'center'
    },
    footerLink: {
        marginTop: '20px',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#888'
    },
    link: {
        color: '#00e5ff',
        textDecoration: 'none',
        fontWeight: 'bold'
    },
    divider: {
        margin: '20px 0',
        textAlign: 'center',
        color: '#555',
        fontSize: '0.8rem'
    },
    demoLinks: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
    },
    demoBtn: {
        background: 'none',
        border: '1px solid #444',
        color: '#aaa',
        padding: '5px 10px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        cursor: 'pointer'
    }
};

export default LoginPage;
