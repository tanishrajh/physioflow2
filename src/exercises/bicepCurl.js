export const bicepCurlRules = {
    name: "Bicep Curl",
    type: "half_body",
    requiredJoints: ["left_shoulder", "left_elbow", "left_wrist", "right_shoulder", "right_elbow", "right_wrist"],
    rules: [
        {
            joint: "left_elbow",
            type: "stability",
            relatedJoints: ["left_shoulder", "left_elbow", "left_hip"],
            idealAngle: 0,
            thresholds: { medium: 15, high: 25 },
            feedback: {
                label: "Left elbow moving",
                action: "Keep elbow pinned"
            }
        },
        {
            joint: "right_elbow",
            type: "stability",
            relatedJoints: ["right_shoulder", "right_elbow", "right_hip"],
            idealAngle: 0,
            thresholds: { medium: 15, high: 25 },
            feedback: {
                label: "Right elbow moving",
                action: "Keep elbow pinned"
            }
        }
    ]
};
