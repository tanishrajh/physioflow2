import React, { useEffect, useRef, useState } from 'react';
import { MoveNetDetector } from '../cv/MoveNetDetector';
import CanvasOverlay from './CanvasOverlay';
import ArrowsOverlay from './ArrowsOverlay';
import FeedbackPanel from './FeedbackPanel';
import ExerciseSelector from './ExerciseSelector';
import PoseWorker from '../workers/pose-analysis.worker.js?worker';

const PhysioLayout = () => {
    const videoRef = useRef(null);
    const wrapperRef = useRef(null);
    const workerRef = useRef(null);
    const detectorRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 640, height: 480 });
    const [currentExercise, setCurrentExercise] = useState('squat');

    useEffect(() => {
        // Initialize Worker
        workerRef.current = new PoseWorker();
        workerRef.current.onmessage = (e) => {
            const { type, payload } = e.data;
            if (type === 'result') {
                if (window.__PHYSIO__) {
                    window.__PHYSIO__.smoothedPose = payload.smoothedPose;
                    window.__PHYSIO__.feedbackEvents = payload.feedbackEvents;
                }
            }
        };

        // Initialize CV
        const initCV = async () => {
            const detector = new MoveNetDetector();
            await detector.initialize();
            const video = await detector.setupCamera(videoRef.current);
            setDimensions({ width: video.videoWidth, height: video.videoHeight });

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
    }, []);

    const handleExerciseChange = (exId) => {
        setCurrentExercise(exId);
        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'setExercise', payload: { exerciseId: exId } });
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.mainArea}>
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
                    <ExerciseSelector current={currentExercise} onChange={handleExerciseChange} />
                    <p style={{ fontSize: '0.9rem' }}>Stand back so required joints are visible.</p>
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
        overflow: 'hidden'
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
    }
};

export default PhysioLayout;
