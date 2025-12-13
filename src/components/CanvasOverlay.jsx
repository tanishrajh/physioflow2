import React, { useRef, useEffect } from 'react';
import { getPhysioState } from '../state/globalState';

const KEYPOINT_PAIRS = [
    ['left_ear', 'left_eye'], ['left_eye', 'nose'],
    ['nose', 'right_eye'], ['right_eye', 'right_ear'],
    ['left_shoulder', 'right_shoulder'],
    ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
    ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
    ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
    ['left_hip', 'right_hip'],
    ['left_hip', 'left_knee'], ['left_knee', 'left_ankle'],
    ['right_hip', 'right_knee'], ['right_knee', 'right_ankle']
];

const CanvasOverlay = ({ width, height }) => {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');

        // Scale for mirroring
        // The video is mirrored via CSS scaleX(-1) usually.
        // But we are drawing on a canvas on TOP of it.
        // If we want to match the mirrored video, we should also mirror the canvas?
        // User requirement: "Mirror drawing context to match mirrored video"
        // "Never draw text mirrored" -> This implies we transform the context.

        const loop = () => {
            const state = getPhysioState();
            const pose = state.smoothedPose || state.poseFrame;

            ctx.clearRect(0, 0, width, height);

            if (pose) {
                ctx.save();
                ctx.translate(width, 0);
                ctx.scale(-1, 1);

                // Draw Skeleton
                if (pose.keypoints) {
                    const keypointMap = {};
                    pose.keypoints.forEach(kp => keypointMap[kp.name] = kp);

                    // Draw Lines
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 4;
                    ctx.beginPath();

                    KEYPOINT_PAIRS.forEach(([p1, p2]) => {
                        const kp1 = keypointMap[p1];
                        const kp2 = keypointMap[p2];
                        // Check visibility from worker state if available? 
                        // Using simplistic score check here as fallback, logic calls for strict gating.
                        // Ideally we read 'visibleJoints' from state, but for now fallback to score >= 0.35
                        if (kp1 && kp2 && kp1.score >= 0.35 && kp2.score >= 0.35) {
                            ctx.moveTo(kp1.x, kp1.y);
                            ctx.lineTo(kp2.x, kp2.y);
                        }
                    });
                    ctx.stroke();

                    // Draw Points
                    pose.keypoints.forEach(kp => {
                        if (kp.score >= 0.35) {
                            ctx.fillStyle = '#00e5ff';
                            ctx.beginPath();
                            ctx.arc(kp.x, kp.y, 6, 0, 2 * Math.PI);
                            ctx.fill();
                            ctx.strokeStyle = 'rgba(255,255,255,0.8)';
                            ctx.stroke();
                        }
                    });
                }
                ctx.restore();
            }

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(rafRef.current);
    }, [width, height]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 10
            }}
        />
    );
};

export default CanvasOverlay;
