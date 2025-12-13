import React, { useEffect, useRef, useState } from 'react';
import { MoveNetDetector } from '../cv/MoveNetDetector';
import CanvasOverlay from './CanvasOverlay';
import ArrowsOverlay from './ArrowsOverlay';
import FeedbackPanel from './FeedbackPanel';
import PoseWorker from '../workers/pose-analysis.worker.js?worker';
import { useNavigate } from 'react-router-dom';
import SessionReport from './SessionReport';

const PhysioLayout = ({ exercise = 'squat' }) => {
    const videoRef = useRef(null);
    const wrapperRef = useRef(null);
    const workerRef = useRef(null);
    const detectorRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 640, height: 480 });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Session State
    const [showReport, setShowReport] = useState(false);
    const [sessionStats, setSessionStats] = useState(null);
    const startTime = useRef(Date.now());
    const issuesSet = useRef(new Set());

    // Accuracy Tracking
    const totalFrames = useRef(0);
    const goodFrames = useRef(0);

    useEffect(() => {
        startTime.current = Date.now();
        issuesSet.current = new Set();
        totalFrames.current = 0;
        goodFrames.current = 0;

        // Initialize Worker
        workerRef.current = new PoseWorker();
        workerRef.current.onmessage = (e) => {
            const { type, payload } = e.data;
            if (type === 'result') {
                if (window.__PHYSIO__) {
                    window.__PHYSIO__.smoothedPose = payload.smoothedPose;
                    window.__PHYSIO__.feedbackEvents = payload.feedbackEvents;
                }

                // Track accuracy
                totalFrames.current++;
                if (payload.feedbackEvents.length === 0) {
                    goodFrames.current++;
                } else {
                    // Track unique issues
                    payload.feedbackEvents.forEach(ev => issuesSet.current.add(ev.label));
                }
            }
        };

        // Initialize Exercise
        workerRef.current.postMessage({ type: 'setExercise', payload: { exerciseId: exercise } });

        // Initialize CV
        const initCV = async () => {
            const detector = new MoveNetDetector();
            await detector.initialize();
            const video = await detector.setupCamera(videoRef.current);
            setDimensions({ width: video.videoWidth, height: video.videoHeight });
            setIsLoading(false); // Camera ready

            detector.start((poseFrame) => {
                if (window.__PHYSIO__) {
                    window.__PHYSIO__.poseFrame = poseFrame;
                }
                workerRef.current.postMessage({ type: 'pose', payload: { poseFrame, timestamp: Date.now() } });
            });

            detectorRef.current = detector;
        };

        initCV().catch(err => console.error(err));

        return () => {
            if (detectorRef.current) detectorRef.current.stop();
            if (workerRef.current) workerRef.current.terminate();
        };
    }, [exercise]);

    const handleExit = () => {
        // Calculate Stats
        const durationMs = Date.now() - startTime.current;

        // Calculate real accuracy
        let accuracy = 100;
        if (totalFrames.current > 0) {
            accuracy = Math.round((goodFrames.current / totalFrames.current) * 100);
        }

        const newStat = {
            id: Date.now(),
            date: new Date().toISOString(),
            durationId: durationMs,
            exercise: exercise,
            accuracy: accuracy,
            issues: Array.from(issuesSet.current)
        };

        setSessionStats(newStat);

        // Save to LocalStorage
        try {
            const history = JSON.parse(localStorage.getItem('physio_history') || '[]');
            history.unshift(newStat);
            localStorage.setItem('physio_history', JSON.stringify(history));
        } catch (e) {
            console.warn("Could not save history to storage", e);
        }

        setShowReport(true);
    }

    const closeReport = () => {
        setShowReport(false);
        navigate('/dashboard');
    }

    return (
        <div style={styles.container}>
            {showReport && sessionStats && (
                <SessionReport sessionData={sessionStats} onClose={closeReport} />
            )}

            <div style={styles.mainArea}>
                <button onClick={handleExit} style={styles.backBtn}>← End Session</button>
                <div
                    ref={wrapperRef}
                    style={{
                        position: 'relative',
                        width: dimensions.width,
                        height: dimensions.height,
                        backgroundColor: '#000',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                    }}
                >
                    {isLoading && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: '#000', color: '#00e5ff', zIndex: 20
                        }}>
                            <div className="spinner" style={{
                                width: '40px', height: '40px', border: '4px solid #333',
                                borderTop: '4px solid #00e5ff', borderRadius: '50%', marginBottom: '20px',
                                animation: 'spin 1s linear infinite'
                            }} />
                            <p>Initializing AI Models...</p>
                        </div>
                    )}
                    <video
                        ref={videoRef}
                        style={{
                            width: '100%',
                            height: '100%',
                            transform: 'scaleX(-1)', // Mirror video
                            objectFit: 'cover'
                        }}
                        playsInline
                        muted
                    />
                    <CanvasOverlay width={dimensions.width} height={dimensions.height} />
                    <ArrowsOverlay width={dimensions.width} height={dimensions.height} />
                </div>

                <div style={styles.controls}>
                    <p style={{ fontSize: '0.9rem', color: '#888' }}>
                        Analyzing: <strong style={{ color: '#fff' }}>{exercise}</strong>
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                        Stand back so required joints are visible.
                    </p>
                </div>
            </div>

            <FeedbackPanel />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0e0e10',
        overflow: 'hidden',
        position: 'relative'
    },
    mainArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    controls: {
        marginTop: '20px',
        color: '#888',
        textAlign: 'center'
    },
    backBtn: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        backdropFilter: 'blur(5px)'
    }
};

export default PhysioLayout;
