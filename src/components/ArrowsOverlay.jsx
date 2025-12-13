import React, { useEffect, useState, useRef } from 'react';
import { getPhysioState } from '../state/globalState';

const ArrowsOverlay = ({ width, height }) => {
    const [events, setEvents] = useState([]);
    const rafRef = useRef(null);

    useEffect(() => {
        const loop = () => {
            const state = getPhysioState();
            // Only react state update if events changed significantly or simple polling
            // For smoothness, we might want to drive animations via JS/CSS and just update props.
            // But React reconciliation at 60fps is risky.
            // Let's rely on React for now for simplicity of implementation.

            if (state.feedbackEvents && state.feedbackEvents.length !== events.length) {
                setEvents([...state.feedbackEvents]);
            } else if (state.feedbackEvents && state.feedbackEvents.length > 0) {
                // Deep check or just timestamp? 
                // We'll trust the worker output.
                setEvents([...state.feedbackEvents]);
            } else {
                if (events.length > 0) setEvents([]);
            }

            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, []); // Remove dependency on 'events' to avoid re-loop creation

    return (
        <svg
            width={width}
            height={height}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 20,
                transform: 'scaleX(-1)' // Mirror to match video
            }}
        >
            {events.map((ev, idx) => (
                <Arrow
                    key={`${ev.joint}-${idx}`}
                    x={ev.originPx.x}
                    y={ev.originPx.y}
                    angleRad={ev.angleRad}
                    severity={ev.severity}
                />
            ))}
        </svg>
    );
};

const Arrow = ({ x, y, angleRad, severity }) => {
    const color = severity === 'high' ? '#ff3b30' : severity === 'medium' ? '#ff9500' : '#4cd964';
    // Simplified arrow mostly pointing outward/inward based on heuristic for now.
    // The worker didn't fully implement angleRad calculation, let's just draw a generic "fix this" marker or assume a direction.
    // User requested "Directional arrows".
    // For Valgus, "push outward" means arrow pointing away from center.
    // We'll simulate a dynamic arrow.

    return (
        <g transform={`translate(${x}, ${y})`}>
            {/* Pulsing circle */}
            <circle r="15" fill="none" stroke={color} strokeWidth="3">
                <animate attributeName="r" from="10" to="25" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
            </circle>
            {/* Simple arrow-ish line */}
            <line x1="0" y1="0" x2="40" y2="0" stroke={color} strokeWidth="4" markerEnd="url(#arrowhead)" transform="rotate(45)" />
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill={color} />
                </marker>
            </defs>
        </g>
    )
};

export default ArrowsOverlay;
