/* eslint-disable no-restricted-globals */
import { OneEuroFilter } from '../cv/OneEuroFilter';
import { squatRules } from '../exercises/squat';
import { bicepCurlRules } from '../exercises/bicepCurl';
import { shoulderPressRules } from '../exercises/shoulderPress';

// Map of available exercises
const EXERCISES = {
    squat: squatRules,
    bicepCurl: bicepCurlRules,
    shoulderPress: shoulderPressRules
};

let currentExercise = squatRules;

// State for filters
const filters = {};
const visibilityHistory = {};
const VISIBILITY_THRESHOLD_MS = 150;

function getFilter(jointName) {
    if (!filters[jointName]) {
        filters[jointName] = new OneEuroFilter();
    }
    return filters[jointName];
}

function checkVisibility(keypoints, timestamp) {
    const visibleJoints = new Set();

    keypoints.forEach(kp => {
        if (kp.score >= 0.35) {
            if (!visibilityHistory[kp.name]) {
                visibilityHistory[kp.name] = { start: timestamp, stable: false };
            }
            const duration = timestamp - visibilityHistory[kp.name].start;
            if (duration >= VISIBILITY_THRESHOLD_MS) {
                visibilityHistory[kp.name].stable = true;
                visibleJoints.add(kp.name);
            }
        } else {
            delete visibilityHistory[kp.name];
        }
    });

    return visibleJoints;
}

function calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) angle = 360.0 - angle;
    return angle;
}

function analyzeExercise(pose, visibleJoints) {
    const feedbackEvents = [];
    if (!currentExercise) return feedbackEvents;

    // Check if required joints for this exercise are visible
    // For 'half_body', we might need to be lenient if feet are missing but we only care about arms.
    // The Rules object has 'requiredJoints'.

    // Strict Global Check? Or Per-Rule Check?
    // Let's do Per-Rule Check generally, but for overall status, maybe we check 'requiredJoints'.
    // If critical joints missing, maybe don't analyze?

    // Let's proceed to check each rule
    currentExercise.rules.forEach(rule => {
        const dependentJoints = rule.relatedJoints || [];
        const allVisible = dependentJoints.every(j => visibleJoints.has(j));

        if (allVisible) {
            if (rule.type === 'angle' || rule.type === 'stability') {
                // Expect 3 joints: hip, knee, ankle OR shoulder, elbow, hip
                // Convention: relatedJoints = [A, B, C]. Angle at B.
                const [aName, bName, cName] = rule.relatedJoints;
                const a = pose.keypoints.find(k => k.name === aName);
                const b = pose.keypoints.find(k => k.name === bName);
                const c = pose.keypoints.find(k => k.name === cName);

                if (a && b && c) {
                    const angle = calculateAngle(a, b, c);
                    const diff = Math.abs(rule.idealAngle - angle);

                    let severity = null;
                    if (diff > rule.thresholds.high) severity = 'high';
                    else if (diff > rule.thresholds.medium) severity = 'medium';

                    if (severity) {
                        feedbackEvents.push({
                            joint: rule.joint, // e.g., left_knee
                            label: rule.feedback.label,
                            actionText: `${rule.feedback.action} ~${Math.round(diff)}°`,
                            diffDeg: diff,
                            severity,
                            confidence: Math.min(a.score, b.score, c.score) * 100,
                            originPx: { x: b.x, y: b.y },
                            angleRad: 0
                        });
                    }
                }
            } else if (rule.type === 'symmetry_y') {
                // e.g. Left Wrist vs Right Wrist Y
                const [n1, n2] = rule.relatedJoints;
                const j1 = pose.keypoints.find(k => k.name === n1);
                const j2 = pose.keypoints.find(k => k.name === n2);

                if (j1 && j2) {
                    // Normalize by height? Or just raw px?
                    // Px varies by distance. Normalizing by Shoulder Distance is reliable.
                    const lShoulder = pose.keypoints.find(k => k.name === 'left_shoulder');
                    const rShoulder = pose.keypoints.find(k => k.name === 'right_shoulder');
                    let scale = 100; // default
                    if (lShoulder && rShoulder) {
                        scale = Math.abs(lShoulder.x - rShoulder.x);
                    }

                    const diffY = Math.abs(j1.y - j2.y);
                    const normalizedDiff = diffY / scale; // Fraction of shoulder width

                    let severity = null;
                    if (normalizedDiff > rule.thresholds.high) severity = 'high';
                    else if (normalizedDiff > rule.thresholds.medium) severity = 'medium';

                    if (severity) {
                        // Attach to the lower hand?
                        const target = j1.y > j2.y ? j1 : j2; // larger y is lower
                        feedbackEvents.push({
                            joint: target.name,
                            label: rule.feedback.label,
                            actionText: rule.feedback.action,
                            diffDeg: 0,
                            severity,
                            confidence: Math.min(j1.score, j2.score) * 100,
                            originPx: { x: target.x, y: target.y }
                        });
                    }
                }
            }
        }
    });

    return feedbackEvents;
}

self.onmessage = (e) => {
    const { type, payload } = e.data;

    if (type === 'setExercise') {
        const { exerciseId } = payload;
        if (EXERCISES[exerciseId]) {
            currentExercise = EXERCISES[exerciseId];
            console.log(`Worker switched to ${currentExercise.name}`);
        }
    }
    else if (type === 'pose') {
        const { poseFrame, timestamp } = payload;

        // 1. One Euro Filtering
        const smoothedKeypoints = poseFrame.keypoints.map(kp => {
            const filter = getFilter(kp.name);
            const { x, y } = filter.filter(kp.x, kp.y, timestamp);
            return { ...kp, x, y };
        });

        const smoothedPose = { ...poseFrame, keypoints: smoothedKeypoints };

        // 2. Visibility Gating
        const visibleJoints = checkVisibility(smoothedKeypoints, timestamp);

        // 3. Analysis
        const feedbackEvents = analyzeExercise(smoothedPose, visibleJoints);

        self.postMessage({
            type: 'result',
            payload: {
                smoothedPose,
                feedbackEvents,
                visibleJoints: Array.from(visibleJoints)
            }
        });
    }
};
