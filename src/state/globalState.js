/**
 * Global state bridge implementation.
 * Connects the Worker result to the UI layer without React overhead.
 */

window.__PHYSIO__ = {
    poseFrame: null,
    smoothedPose: null,
    feedbackEvents: [],
    currentExercise: 'squat', // Default
    meta: {
        fps: 0,
        processingTime: 0
    }
};

export const getPhysioState = () => {
    return window.__PHYSIO__;
};

export const setExercise = (exerciseId) => {
    if (window.__PHYSIO__) {
        window.__PHYSIO__.currentExercise = exerciseId;
    }
}
