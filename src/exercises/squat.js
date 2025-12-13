export const squatRules = {
    name: "Squat",
    type: "full_body",
    requiredJoints: ["left_hip", "left_knee", "left_ankle", "right_hip", "right_knee", "right_ankle"],
    rules: [
        {
            joint: "left_knee",
            type: "angle",
            relatedJoints: ["left_hip", "left_knee", "left_ankle"],
            idealAngle: 180,
            thresholds: { medium: 6, high: 12 },
            feedback: {
                label: "Knees collapsing in",
                action: "Push knees out"
            }
        },
        {
            joint: "right_knee",
            type: "angle",
            relatedJoints: ["right_hip", "right_knee", "right_ankle"],
            idealAngle: 180,
            thresholds: { medium: 6, high: 12 },
            feedback: {
                label: "Knees collapsing in",
                action: "Push knees out"
            }
        }
    ],
    repLogic: {
        type: 'angle',
        joint: 'left_knee', // Simplified for demo
        relatedJoints: ['left_hip', 'left_knee', 'left_ankle'],
        phases: {
            extension: { threshold: 160, guide: "Squat Down", greaterThan: true, next: 'flexion' },
            flexion: { threshold: 100, guide: "Stand Up", greaterThan: false, next: 'extension' }
        }
    }
};
