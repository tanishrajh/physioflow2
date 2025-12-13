import React, { useEffect, useState, useRef } from 'react';
import { getPhysioState } from '../state/globalState';

const FeedbackPanel = () => {
    const [events, setEvents] = useState([]);
    const [repStats, setRepStats] = useState({ repCount: 0, guidance: 'Get Ready' });
    const rafRef = useRef(null);

    useEffect(() => {
        const loop = () => {
            const state = getPhysioState();

            if (JSON.stringify(state.feedbackEvents) !== JSON.stringify(events)) {
                setEvents(state.feedbackEvents || []);
            }
            if (state.repStats && (state.repStats.repCount !== repStats.repCount || state.repStats.guidance !== repStats.guidance)) {
                setRepStats(state.repStats);
            }
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, [events, repStats]);

    return (
        <div style={styles.panel}>
            <h2 style={styles.header}>PhysioFlow Assistant</h2>

            {/* Rep Counter & Guidance Box */}
            <div style={styles.guidanceBox}>
                <div style={styles.repCount}>
                    <span style={styles.repVal}>{repStats.repCount}</span>
                    <span style={styles.repLabel}>REPS</span>
                </div>
                <div style={styles.guidanceText}>
                    {repStats.guidance}
                </div>
            </div>

            <h3 style={styles.subHeader}>Analysis</h3>
            {events.length === 0 ? (
                <div style={styles.empty}>
                    <p>Pose looking good! 👍</p>
                    <small>Keep it smooth</small>
                </div>
            ) : (
                events.map((ev, i) => (
                    <div key={i} style={{ ...styles.card, borderLeft: `4px solid ${getColor(ev.severity)}` }}>
                        <h3 style={styles.cardTitle}>{ev.label}</h3>
                        <p style={styles.action}>{ev.actionText}</p>
                        <div style={styles.meta}>
                            <span>{Math.round(ev.confidence)}% Confidence</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const getColor = (severity) => {
    if (severity === 'high') return '#ff3b30';
    if (severity === 'medium') return '#ff9500';
    return '#4cd964';
}

const styles = {
    panel: {
        width: '320px',
        backgroundColor: '#1c1c1e',
        color: '#fff',
        padding: '24px',
        height: '100%',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        fontFamily: 'Inter, sans-serif',
        zIndex: 100
    },
    header: {
        fontSize: '1.4rem',
        fontWeight: '700',
        marginBottom: '10px',
        borderBottom: '1px solid #333',
        paddingBottom: '15px',
        color: '#00e5ff'
    },
    guidanceBox: {
        backgroundColor: '#2c2c2e',
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'center',
        border: '1px solid #444',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    },
    repCount: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '10px'
    },
    repVal: {
        fontSize: '3.5rem',
        fontWeight: '800',
        color: '#4cd964',
        lineHeight: 1
    },
    repLabel: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#666'
    },
    guidanceText: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    subHeader: {
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        color: '#666',
        marginTop: '10px'
    },
    empty: {
        color: '#888',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '8px'
    },
    card: {
        backgroundColor: '#2c2c2e',
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    cardTitle: {
        fontSize: '0.95rem',
        fontWeight: '600',
        margin: 0,
        color: '#eee'
    },
    action: {
        fontSize: '0.9rem',
        color: '#ddd',
        margin: 0
    },
    meta: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: '#aaa',
        marginTop: '4px'
    }
};

export default FeedbackPanel;
