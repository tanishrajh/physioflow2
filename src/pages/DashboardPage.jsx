import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MapComponent from '../components/MapComponent';
import { Activity, MapPin, FileText, User, PlayCircle, LogOut } from 'lucide-react';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const startSession = () => {
        navigate('/session');
    };

    const [history, setHistory] = React.useState([]);

    React.useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('physio_history') || '[]');
            setHistory(stored);
        } catch (e) {
            console.error("Storage access error:", e);
        }
    }, []);

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.logo}>
                    <Activity color="#00e5ff" />
                    <span>PhysioFlow</span>
                </div>
                <div style={styles.userControls}>
                    <div style={styles.userInfo}>
                        <img src={user.avatar} alt="Avatar" style={styles.avatar} />
                        <span>{user.name}</span>
                    </div>
                    <button onClick={handleLogout} style={styles.logoutBtn}><LogOut size={16} /></button>
                </div>
            </div>

            <main style={styles.main}>
                <h1 style={styles.welcome}>Welcome back, {user.name.split(' ')[0]}</h1>

                {user.hasConsulted ? (
                    <div style={styles.grid}>
                        {/* Report Card */}
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <FileText color="#00e5ff" />
                                <h3>Consultation Report</h3>
                            </div>
                            <div style={styles.reportContent}>
                                <div style={styles.row}>
                                    <span style={styles.label}>Diagnosis:</span>
                                    <span>{user.report.diagnosis}</span>
                                </div>
                                <div style={styles.row}>
                                    <span style={styles.label}>Physiotherapist:</span>
                                    <span>
                                        {user.report.ptName}
                                        <div style={{ fontSize: '0.8em', color: '#666', marginTop: '2px' }}>
                                            📞 {user.report.ptContact}
                                        </div>
                                    </span>
                                </div>
                                <div style={styles.row}>
                                    <span style={styles.label}>Date:</span>
                                    <span>{user.report.date}</span>
                                </div>
                                <p style={styles.notes}>"{user.report.notes}"</p>
                            </div>
                        </div>

                        {/* Action Card */}
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <Activity color="#4cd964" />
                                <h3>Prescribed Activity</h3>
                            </div>
                            <div style={styles.actionContent}>
                                <div style={styles.exerciseBadge}>
                                    {user.report.prescribedExercise === 'bicepCurl' ? 'Bicep Curl (Arms)' : user.report.prescribedExercise}
                                </div>
                                <p>{user.report.prescriptionDetails}</p>
                                <div style={styles.progressContainer}>
                                    <div style={styles.progressBar}>
                                        <div style={{ ...styles.progressFill, width: `${user.report.progress}%` }}></div>
                                    </div>
                                    <span style={styles.progressText}>{user.report.progress}% Complete</span>
                                </div>
                                <button style={styles.startBtn} onClick={startSession}>
                                    <PlayCircle size={20} />
                                    Start Session
                                </button>
                            </div>
                        </div>

                        {/* History Card */}
                        <div style={{ ...styles.card, gridColumn: '1 / -1' }}>
                            <div style={styles.cardHeader}>
                                <Activity color="#ff9500" />
                                <h3>Recent Sessions</h3>
                            </div>
                            {history.length === 0 ? (
                                <p style={{ color: '#888' }}>No sessions recorded yet.</p>
                            ) : (
                                <div style={styles.historyList}>
                                    {history.map(sess => (
                                        <div key={sess.id} style={styles.historyItem}>
                                            <div style={styles.historyLeft}>
                                                <strong>{sess.exercise}</strong>
                                                <span style={styles.date}>{new Date(sess.date).toLocaleDateString()}</span>
                                            </div>
                                            <div style={styles.historyRight}>
                                                <div style={{ ...styles.scoreBadge, color: sess.accuracy > 80 ? '#4cd964' : '#ff9500' }}>
                                                    {sess.accuracy}%
                                                </div>
                                                <span style={styles.duration}>{Math.round(sess.durationId / 1000)}s</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {/* No PT Card, Map Card Logic (SAME) */}
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <User color="#ff9500" />
                                <h3>No Consultations Available</h3>
                            </div>
                            <p style={{ color: '#aaa' }}>You haven't consulted a Physiotherapist yet. We recommend booking a session to get a personalized recovery plan.</p>
                        </div>

                        <div style={{ ...styles.card, gridColumn: '1 / -1' }}>
                            <div style={styles.cardHeader}>
                                <MapPin color="#ff3b30" />
                                <h3>Nearby Specialists</h3>
                            </div>
                            <MapComponent />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0e0e10',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid #222',
        backgroundColor: '#1c1c1e'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontWeight: 'bold',
        fontSize: '1.2rem'
    },
    userControls: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%'
    },
    logoutBtn: {
        background: 'none',
        border: 'none',
        color: '#666',
        cursor: 'pointer',
        padding: '5px'
    },
    main: {
        width: '100%',
        padding: '40px 40px',
        boxSizing: 'border-box'
    },
    welcome: {
        fontSize: '2rem',
        marginBottom: '30px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
    },
    card: {
        backgroundColor: '#1c1c1e',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        borderBottom: '1px solid #333',
        paddingBottom: '15px'
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        borderBottom: '1px solid #2c2c2e',
        paddingBottom: '10px'
    },
    label: {
        color: '#888'
    },
    notes: {
        fontStyle: 'italic',
        color: '#aaa',
        marginTop: '15px',
        backgroundColor: '#252527',
        padding: '10px',
        borderRadius: '8px'
    },
    actionContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    exerciseBadge: {
        backgroundColor: 'rgba(76, 217, 100, 0.2)',
        color: '#4cd964',
        padding: '5px 10px',
        borderRadius: '4px',
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    },
    startBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        backgroundColor: '#00e5ff',
        color: '#000',
        border: 'none',
        padding: '12px',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '10px',
        transition: 'transform 0.1s',
        ':active': {
            transform: 'scale(0.98)'
        }
    },
    progressContainer: {
        margin: '10px 0'
    },
    progressBar: {
        height: '6px',
        backgroundColor: '#333',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: '5px'
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4cd964'
    },
    progressText: {
        fontSize: '0.8rem',
        color: '#888'
    },
    historyList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    historyItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        backgroundColor: '#252527',
        borderRadius: '8px'
    },
    historyLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    date: {
        fontSize: '0.8rem',
        color: '#888'
    },
    historyRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    scoreBadge: {
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    duration: {
        color: '#666',
        fontSize: '0.9rem'
    }
};

export default DashboardPage;
