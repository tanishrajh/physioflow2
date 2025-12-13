import React, { useEffect, useState, useRef } from 'react';
import { getPhysioState } from '../state/globalState';

const FeedbackPanel = () => {
    const [events, setEvents] = useState([]);
    const rafRef = useRef(null);

    useEffect(() => {
        const loop = () => {
            const state = getPhysioState();
            // Simple dirty check or just continuously sync
            // React state update only if different to avoid flickering?
            // Actually, for a panel, 5-10fps update is fine, but we are inside RAF.
            // Let's just debounce or check length.

            // To prevent massive re-renders, we can check basic equality
            if (JSON.stringify(state.feedbackEvents) !== JSON.stringify(events)) {
                setEvents(state.feedbackEvents || []);
            }
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, [events]);

    return (
        <div style={styles.panel}>
            <h2 style={styles.header}>PhysioFlow Assistant</h2>
            {events.length === 0 ? (
                <div style={styles.empty}>
                    <p>Pose looking good! 👍</p>
                    <small>Maintained continuous visibility...</small>
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
        width: '300px',
        backgroundColor: '#1c1c1e',
        color: '#fff',
        padding: '20px',
        height: '100%',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        fontFamily: 'Inter, sans-serif',
        zIndex: 100
    },
    header: {
        fontSize: '1.2rem',
        fontWeight: '700',
        marginBottom: '10px',
        borderBottom: '1px solid #333',
        paddingBottom: '10px'
    },
    empty: {
        color: '#888',
        textAlign: 'center',
        marginTop: '50px'
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
