export const shoulderPressRules = {
    name: "Shoulder Press",
    type: "half_body",
    requiredJoints: ["left_shoulder", "left_elbow", "left_wrist", "right_shoulder", "right_elbow", "right_wrist"],
    // For Shoulder Press, we want symmetry in extension.
    // Wrist Y should be close to other Wrist Y
    rules: [
        {
            joint: "nose", // Global feedback
            type: "symmetry_y",
            relatedJoints: ["left_wrist", "right_wrist"],
            idealDiff: 0, // Pixels or normalized coords? Normalized is better.
            thresholds: { medium: 0.1, high: 0.2 }, // 0.1 of screen height
            feedback: {
                label: "Uneven lift",
                action: "Push both arms up evenly"
            }
        }
    ]
};
