/* eslint-disable no-restricted-globals */
import { OneEuroFilter } from '../cv/OneEuroFilter';
import { squatRules } from '../exercises/squat';
import { bicepCurlRules } from '../exercises/bicepCurl';
import { shoulderPressRules } from '../exercises/shoulderPress';

// map of available exercises
const EXERCISES = {
    squat: squatRules,
    bicepCurl: bicepCurlRules,
    shoulderPress: shoulderPressRules
};

let currentExercise = squatRules;

// state for filters
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

    // ensure all required joints are visible for each rule
    currentExercise.rules.forEach(rule => {
        const dependentJoints = rule.relatedJoints || [];
        const allVisible = dependentJoints.every(j => visibleJoints.has(j));

        if (allVisible) {
            if (rule.type === 'angle' || rule.type === 'stability') {
                // convention: relatedjoints = [a, b, c]. angle is at b.
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
                            actionText: rule.feedback.action,
                            diffDeg: diff,
                            severity,
                            confidence: Math.min(a.score, b.score, c.score) * 100,
                            originPx: { x: b.x, y: b.y },
                            angleRad: 0
                        });
                    }
                }
            } else if (rule.type === 'symmetry_y') {
                // e.g. left wrist vs right wrist y
                const [n1, n2] = rule.relatedJoints;
                const j1 = pose.keypoints.find(k => k.name === n1);
                const j2 = pose.keypoints.find(k => k.name === n2);

                if (j1 && j2) {
                    // normalize using shoulder distance to account for camera depth
                    const lShoulder = pose.keypoints.find(k => k.name === 'left_shoulder');
                    const rShoulder = pose.keypoints.find(k => k.name === 'right_shoulder');
                    let scale = 100; // default
                    if (lShoulder && rShoulder) {
                        scale = Math.abs(lShoulder.x - rShoulder.x);
                    }

                    const diffY = Math.abs(j1.y - j2.y);
                    const normalizedDiff = diffY / scale; // fraction of shoulder width

                    let severity = null;
                    if (normalizedDiff > rule.thresholds.high) severity = 'high';
                    else if (normalizedDiff > rule.thresholds.medium) severity = 'medium';

                    if (severity) {
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

    // --- rep counting logic ---
    let repUpdate = { repCount: currentRepCount, guidance: currentGuidance, phase: currentPhase };

    if (currentExercise.repLogic) {
        const { joint, relatedJoints, phases } = currentExercise.repLogic;

        // find joints
        const [aN, bN, cN] = relatedJoints;
        const a = pose.keypoints.find(k => k.name === aN);
        const b = pose.keypoints.find(k => k.name === bN);
        const c = pose.keypoints.find(k => k.name === cN);

        if (a && b && c) {
            const angle = calculateAngle(a, b, c);
            const activePhase = phases[currentPhase];

            // check if we hit the target angle to switch phases

            const nextPhaseName = activePhase.next;
            const targetPhase = phases[nextPhaseName];

            const hitTarget = targetPhase.greaterThan
                ? angle > targetPhase.threshold
                : angle < targetPhase.threshold;

            if (hitTarget) {
                // transition!
                console.log(`Phase Switch: ${currentPhase} -> ${nextPhaseName} (Angle: ${Math.round(angle)})`);
                currentPhase = nextPhaseName;
                currentGuidance = targetPhase.guide;

                // if we returned to start (extension), rep++
                if (nextPhaseName === 'extension') {
                    currentRepCount++;

                    // calculate tempo
                    const now = Date.now();
                    const duration = (now - lastRepTime) / 1000;
                    lastRepTime = now;

                    if (duration > 1 && duration < 10) {
                        lastRepDuration = duration.toFixed(1);
                    }
                }

                repUpdate = {
                    repCount: currentRepCount,
                    guidance: currentGuidance,
                    phase: currentPhase,
                    tempo: lastRepDuration
                };
            }
        }
    }

    return { feedbackEvents, repUpdate };
}

let currentRepCount = 0;
let currentPhase = 'extension';
let currentGuidance = 'Get Ready';
let lastRepTime = Date.now();
let lastRepDuration = "0.0";

self.onmessage = (e) => {
    const { type, payload } = e.data;

    if (type === 'setExercise') {
        const { exerciseId } = payload;
        if (EXERCISES[exerciseId]) {
            currentExercise = EXERCISES[exerciseId];
            currentRepCount = 0;
            currentPhase = 'extension';
            currentGuidance = currentExercise.repLogic ? currentExercise.repLogic.phases.extension.guide : 'Start';
            lastRepTime = Date.now();
            lastRepDuration = "0.0";
            console.log(`Worker switched to ${currentExercise.name}`);
        }
    }
    else if (type === 'pose') {
        const { poseFrame, timestamp } = payload;

        // smooth keypoints using oneeuro filter
        const smoothedKeypoints = poseFrame.keypoints.map(kp => {
            const filter = getFilter(kp.name);
            const { x, y } = filter.filter(kp.x, kp.y, timestamp);
            return { ...kp, x, y };
        });
        const smoothedPose = { ...poseFrame, keypoints: smoothedKeypoints };
        const visibleJoints = checkVisibility(smoothedKeypoints, timestamp);

        // analyze the smoothed pose
        const analysis = analyzeExercise(smoothedPose, visibleJoints);

        self.postMessage({
            type: 'result',
            payload: {
                smoothedPose,
                feedbackEvents: analysis.feedbackEvents,
                repStats: analysis.repUpdate,
                visibleJoints: Array.from(visibleJoints)
            }
        });
    }
};
