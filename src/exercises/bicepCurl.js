export const bicepCurlRules = {
    name: "Bicep Curl",
    type: "half_body",
    requiredJoints: ["left_shoulder", "left_elbow", "left_wrist", "right_shoulder", "right_elbow", "right_wrist"],
    rules: [
        {
            joint: "left_elbow",
            type: "stability",
            relatedJoints: ["left_elbow", "left_shoulder", "left_hip"], // Vertex: Shoulder
            idealAngle: 0,
            thresholds: { medium: 20, high: 35 },
            feedback: {
                label: "Elbow swinging forward",
                action: "Keep elbow pinned"
            }
        },
        {
            joint: "right_elbow",
            type: "stability",
            relatedJoints: ["right_elbow", "right_shoulder", "right_hip"], // Vertex: Shoulder
            idealAngle: 0,
            thresholds: { medium: 20, high: 35 },
            feedback: {
                label: "Elbow swinging forward",
                action: "Keep elbow pinned"
            }
        },
        {
            joint: "torso",
            type: "stability",
            relatedJoints: ["right_shoulder", "right_hip", "right_knee"], // Vertex: Hip
            idealAngle: 180,
            thresholds: { medium: 10, high: 20 },
            feedback: {
                label: "Leaning back",
                action: "Stand up straight"
            }
        },
        {
            joint: "shoulders",
            type: "symmetry_y",
            relatedJoints: ["left_shoulder", "right_shoulder"],
            thresholds: { medium: 0.15, high: 0.25 },
            feedback: {
                label: "Shoulders uneven",
                action: "Keep shoulders level"
            }
        }
    ],
    repLogic: {
        type: 'angle',
        joint: 'right_elbow', // For demo, assuming right arm user
        relatedJoints: ['right_shoulder', 'right_elbow', 'right_wrist'],
        phases: {
            extension: { threshold: 150, guide: "Curl Up", greaterThan: true, next: 'flexion' },
            flexion: { threshold: 60, guide: "Lower Slowly", greaterThan: false, next: 'extension' }
        }
    }
};
