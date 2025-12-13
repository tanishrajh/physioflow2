import React from 'react';
import { Activity, Instagram, Twitter, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.content}>
                <div style={styles.brand}>
                    <Activity color="#00e5ff" size={24} />
                    <span style={styles.logoText}>PhysioFlow</span>
                </div>
                <div style={styles.links}>
                    <span style={styles.link}>About</span>
                    <span style={styles.link}>Contact</span>
                    <span style={styles.link}>Privacy</span>
                </div>
                <div style={styles.socials}>
                    <Twitter size={20} color="#888" style={styles.icon} />
                    <Instagram size={20} color="#888" style={styles.icon} />
                    <Mail size={20} color="#888" style={styles.icon} />
                </div>
                <div style={styles.copy}>
                    &copy; 2025 PhysioFlow AI. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        width: '100%',
        padding: '30px 0',
        backgroundColor: 'rgba(28, 28, 30, 0.5)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: 'auto', // Pushes footer to bottom if flex container
    },
    content: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '0 20px',
        color: '#888',
        fontSize: '0.9rem'
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'white',
        fontWeight: 'bold',
        marginBottom: '10px'
    },
    logoText: {
        fontSize: '1.2rem',
        background: 'linear-gradient(45deg, #00e5ff, #2979ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    links: {
        display: 'flex',
        gap: '20px',
        cursor: 'pointer'
    },
    link: {
        transition: 'color 0.2s',
        ':hover': { color: '#00e5ff' }
    },
    socials: {
        display: 'flex',
        gap: '15px'
    },
    icon: {
        cursor: 'pointer',
        transition: 'color 0.2s',
    },
    copy: {
        fontSize: '0.8rem',
        color: '#555',
        marginTop: '10px'
    }
};

export default Footer;
