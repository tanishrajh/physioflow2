import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Lock, Type } from 'lucide-react';
import Footer from '../components/Footer';

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        const res = register(formData);
        if (res.success) {
            alert("Registration successful! Please login.");
            navigate('/login');
        } else {
            setError(res.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <h2 style={styles.title}>Create Account</h2>
                        <p style={styles.subtitle}>Join PhysioFlow today</p>
                    </div>

                    {error && <div style={styles.error}>{error}</div>}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <Type size={20} color="#666" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                style={styles.input}
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <User size={20} color="#666" />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                style={styles.input}
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <Lock size={20} color="#666" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                style={styles.input}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <Lock size={20} color="#666" />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                style={styles.input}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" style={styles.submitBtn}>
                            Register <UserPlus size={18} />
                        </button>
                    </form>

                    <div style={styles.footerLink}>
                        Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
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
        overflowX: 'hidden', // Added safety
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
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '20px'
    },
    card: {
        backgroundColor: '#1c1c1e',
        padding: '40px',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        border: '1px solid #333'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    title: {
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: 'white'
    },
    subtitle: {
        color: '#888'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#2c2c2e',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid #444',
        transition: 'border-color 0.2s',
        ':focus-within': {
            borderColor: '#00e5ff'
        }
    },
    input: {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '1rem',
        outline: 'none',
        width: '100%'
    },
    submitBtn: {
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
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '10px',
        transition: 'opacity 0.2s',
        ':hover': {
            opacity: 0.9
        }
    },
    error: {
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        color: '#ff3b30',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '0.9rem'
    },
    footerLink: {
        marginTop: '25px',
        textAlign: 'center',
        color: '#888',
        fontSize: '0.9rem'
    },
    link: {
        color: '#00e5ff',
        textDecoration: 'none',
        fontWeight: 'bold'
    }
};

export default RegisterPage;
