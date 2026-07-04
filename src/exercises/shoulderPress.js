export const shoulderPressRules = {
    name: "Shoulder Press",
    type: "half_body",
    requiredJoints: ["left_shoulder", "left_elbow", "left_wrist", "right_shoulder", "right_elbow", "right_wrist"],
    // ensure symmetry in arm extension
    rules: [
        {
            joint: "nose", // global feedback
            type: "symmetry_y",
            relatedJoints: ["left_wrist", "right_wrist"],
            idealDiff: 0,
            thresholds: { medium: 0.1, high: 0.2 },
            feedback: {
                label: "Uneven lift",
                action: "Push both arms up evenly"
            }
        }
    ]
};
