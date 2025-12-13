import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, FileText, Activity, Save, X, Clipboard } from 'lucide-react';
import Footer from '../components/Footer';

const PTDashboardPage = () => {
    const { user, getAllPatients, updatePatientPrescription } = useAuth();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientHistory, setPatientHistory] = useState([]);

    // Auto-refresh patient list
    useEffect(() => {
        const fetchPatients = () => {
            setPatients(getAllPatients());
        };
        fetchPatients();
        const interval = setInterval(fetchPatients, 2000); // Check every 2s
        return () => clearInterval(interval);
    }, [user]); // Re-run if user changes (or on mount)

    // Edit Form State
    const [exercise, setExercise] = useState('bicepCurl');
    const [notes, setNotes] = useState('');

    const handlePatientClick = (p) => {
        setSelectedPatient(p);
        setExercise(p.report?.prescribedExercise || 'bicepCurl');
        setNotes(p.report?.notes || '');

        // Fetch History
        try {
            const allHistory = JSON.parse(localStorage.getItem('physio_history') || '[]');
            const userHistory = allHistory.filter(h => h.userId == p.id); // Filter by ID
            setPatientHistory(userHistory);
        } catch (e) {
            console.error("Error loading patient history", e);
            setPatientHistory([]);
        }
    };



    const handleSave = () => {
        if (selectedPatient) {
            updatePatientPrescription(selectedPatient.id, exercise, notes);
            alert(`Prescription updated for ${selectedPatient.name}`);
            setSelectedPatient(null);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <h1>Dr. {user?.name?.replace('Dr. ', '')}</h1>
                    <span style={styles.badge}>Physiotherapist</span>
                </div>
            </div>

            <main style={styles.main}>
                <h2 style={styles.sectionTitle}>Your Patients ({patients.length})</h2>

                <div style={styles.grid}>
                    {patients.length === 0 ? (
                        <p style={{ color: '#888' }}>No patients assigned yet.</p>
                    ) : (
                        patients.map(p => (
                            <div key={p.id} style={styles.card} onClick={() => handlePatientClick(p)}>
                                <div style={styles.cardHeader}>
                                    <img src={p.avatar} alt={p.name} style={styles.avatar} />
                                    <div>
                                        <h3>{p.name}</h3>
                                        <p style={styles.subtext}>ID: {p.id}</p>
                                    </div>
                                </div>
                                <div style={styles.stats}>
                                    <div style={styles.stat}>
                                        <Activity size={16} color="#00e5ff" />
                                        <span>{p.report?.prescribedExercise || 'None'}</span>
                                    </div>

                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Patient Detail Modal */}
            {selectedPatient && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <h2>Managing: {selectedPatient.name}</h2>
                            <button onClick={() => setSelectedPatient(null)} style={styles.closeBtn}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={styles.modalBody}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Prescribed Exercise</label>
                                <select
                                    style={styles.select}
                                    value={exercise}
                                    onChange={(e) => setExercise(e.target.value)}
                                >
                                    <option value="bicepCurl">Bicep Curl (Arms)</option>
                                    <option value="squat">Squat (Legs)</option>
                                    <option value="shoulderPress">Shoulder Press (Shoulders)</option>
                                    <option value="lunge">Lunge (Legs)</option>
                                </select>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Consultation Notes</label>
                                <textarea
                                    style={styles.textarea}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Enter your diagnosis and instructions..."
                                    rows={5}
                                />
                            </div>

                            <div style={styles.reportPreview}>
                                <h4>Current Status:</h4>
                                <p><strong>Last Diagnosis:</strong> {selectedPatient.report?.diagnosis || 'N/A'}</p>

                            </div>

                            <h4 style={{ marginTop: '20px', marginBottom: '10px', color: '#00e5ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Clipboard size={18} /> Session History
                            </h4>

                            {patientHistory.length === 0 ? (
                                <p style={{ color: '#666', fontStyle: 'italic' }}>No session history found.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {patientHistory.map((session, idx) => (
                                        <div key={idx} style={styles.historyCard}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                <span style={{ fontWeight: 'bold', color: '#fff' }}>{session.exercise}</span>
                                                <span style={{ color: '#888', fontSize: '0.8rem' }}>{new Date(session.date).toLocaleDateString()}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#ccc' }}>
                                                <span>Accuracy: <strong style={{ color: session.accuracy > 80 ? '#4cd964' : '#ff3b30' }}>{session.accuracy}%</strong></span>
                                                <span>Duration: {Math.round(session.durationId / 1000)}s</span>
                                            </div>
                                            {session.issues && session.issues.length > 0 && (
                                                <div style={{ marginTop: '5px' }}>
                                                    <span style={{ color: '#ff3b30', fontSize: '0.8rem' }}>Issues: {session.issues.join(', ')}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={styles.modalFooter}>
                            <button style={styles.saveBtn} onClick={handleSave}>
                                <Save size={18} /> Save Prescription
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
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
        padding: '30px 20px',
        backgroundColor: '#1c1c1e',
        borderBottom: '1px solid #333'
    },
    headerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    badge: {
        backgroundColor: '#00e5ff',
        color: 'black',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 'bold'
    },
    main: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px',
        minHeight: '60vh'
    },
    sectionTitle: {
        marginBottom: '20px',
        color: '#888'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
    },
    card: {
        backgroundColor: '#1c1c1e',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #333',
        cursor: 'pointer',
        transition: 'transform 0.2s, border-color 0.2s',
        ':hover': {
            transform: 'translateY(-2px)',
            borderColor: '#00e5ff'
        }
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '15px'
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        objectFit: 'cover'
    },
    stats: {
        display: 'flex',
        gap: '15px',
        color: '#aaa',
        fontSize: '0.9rem'
    },
    stat: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    // Modal Styles
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)'
    },
    modal: {
        backgroundColor: '#1c1c1e',
        width: '90%',
        maxWidth: '500px',
        borderRadius: '20px',
        border: '1px solid #333',
        overflow: 'hidden',
        maxHeight: '90vh', // Prevent full screen
        display: 'flex',
        flexDirection: 'column'
    },
    modalHeader: {
        padding: '20px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: '#888',
        cursor: 'pointer'
    },
    modalBody: {
        padding: '20px',
        overflowY: 'auto', // Enable scrolling
        flex: 1
    },
    inputGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#aaa',
        fontSize: '0.9rem'
    },
    select: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#2c2c2e',
        border: '1px solid #444',
        borderRadius: '8px',
        color: 'white',
        fontSize: '1rem',
        outline: 'none'
    },
    textarea: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#2c2c2e',
        border: '1px solid #444',
        borderRadius: '8px',
        color: 'white',
        fontSize: '1rem',
        outline: 'none',
        resize: 'vertical'
    },
    reportPreview: {
        backgroundColor: '#2c2c2e',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#ccc'
    },
    modalFooter: {
        padding: '20px',
        borderTop: '1px solid #333',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    saveBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: '#00e5ff',
        color: 'black',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    historyCard: {
        backgroundColor: '#2c2c2e',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #444'
    }
};

export default PTDashboardPage;
