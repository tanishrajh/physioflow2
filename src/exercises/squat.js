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
                label: "Left knee collapsing",
                action: "Push your left knee outward"
            }
        },
        {
            joint: "right_knee",
            type: "angle",
            relatedJoints: ["right_hip", "right_knee", "right_ankle"],
            idealAngle: 180,
            thresholds: { medium: 6, high: 12 },
            feedback: {
                label: "Right knee collapsing",
                action: "Push your right knee outward"
            }
        }
    ]
};
