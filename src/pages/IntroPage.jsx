import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

const IntroPage = () => {
    const navigate = useNavigate();
    const fullText = "Your Personal AI Physiotherapist";
    const [text, setText] = useState('');
    const [index, setIndex] = useState(0);

    // Typewriter Effect
    useEffect(() => {
        if (index < fullText.length) {
            const timeout = setTimeout(() => {
                setText(prev => prev + fullText[index]);
                setIndex(prev => prev + 1);
            }, 60);
            return () => clearTimeout(timeout);
        }
    }, [index]);

    return (
        <div style={styles.container}>
            {/* Animated Background */}
            <div style={styles.background}>
                <div style={styles.gradientOrb1}></div>
                <div style={styles.gradientOrb2}></div>
                <div style={styles.gridOverlay}></div>
            </div>

            <div style={styles.content}>
                <div style={styles.logoWrapper}>
                    <Activity size={80} color="#00e5ff" style={styles.logoIcon} />
                </div>

                <h1 style={styles.title}>PhysioFlow</h1>

                <div style={styles.typewriterWrapper}>
                    <span style={styles.typewriter}>{text}</span>
                    <span style={styles.cursor}>|</span>
                </div>

                <p style={styles.description}>
                    Recover faster with real-time AI computer vision guidance.<br />
                    No expensive sensors. Just you and your camera.
                </p>

                <button style={styles.ctaButton} onClick={() => navigate('/login')}>
                    Get Started <ArrowRight size={20} />
                </button>
            </div>

            <Footer />
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        overflowX: 'hidden', // Fix bottom scrollbar
        overflowY: 'auto'
    },
    background: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundColor: '#050505',
        overflow: 'hidden'
    },
    gradientOrb1: {
        position: 'absolute',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(0, 229, 255, 0.15) 0%, rgba(0,0,0,0) 70%)',
        top: '-10%',
        left: '-10%',
        borderRadius: '50%',
        animation: 'float 20s infinite ease-in-out'
    },
    gradientOrb2: {
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(41, 121, 255, 0.15) 0%, rgba(0,0,0,0) 70%)',
        bottom: '0%',
        right: '-5%',
        borderRadius: '50%',
        animation: 'float 25s infinite ease-in-out reverse'
    },
    gridOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        opacity: 0.5
    },
    content: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px',
        zIndex: 1
    },
    logoWrapper: {
        padding: '25px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '50%',
        marginBottom: '30px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 0 50px rgba(0, 229, 255, 0.1)',
        animation: 'pulse 3s infinite ease-in-out'
    },
    title: {
        fontSize: '5rem',
        fontWeight: '900',
        margin: '0 0 10px 0',
        background: 'linear-gradient(135deg, #ffffff 0%, #00e5ff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-3px',
        lineHeight: '1'
    },
    typewriterWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '40px',
        height: '40px'
    },
    typewriter: {
        fontSize: '1.5rem',
        color: '#aaa',
        fontFamily: 'monospace',
    },
    cursor: {
        fontSize: '1.5rem',
        color: '#00e5ff',
        animation: 'blink 1s step-end infinite',
        marginLeft: '5px'
    },
    description: {
        maxWidth: '600px',
        lineHeight: '1.8',
        color: '#888',
        marginBottom: '50px',
        fontSize: '1.2rem'
    },
    ctaButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '18px 48px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#000',
        backgroundColor: '#00e5ff',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        ':hover': {
            transform: 'scale(1.05) translateY(-2px)',
            boxShadow: '0 10px 40px rgba(0, 229, 255, 0.5)'
        }
    }
};

// Inject CSS animations dynamically
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes float { 
    0% { transform: translate(0, 0); } 
    50% { transform: translate(30px, 50px); } 
    100% { transform: translate(0, 0); } 
}
@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.4); }
    70% { box-shadow: 0 0 0 20px rgba(0, 229, 255, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0); }
}
`;
document.head.appendChild(styleSheet);

export default IntroPage;
