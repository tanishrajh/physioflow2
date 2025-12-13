export const bicepCurlRules = {
    name: "Bicep Curl",
    type: "half_body",
    requiredJoints: ["left_shoulder", "left_elbow", "left_wrist", "right_shoulder", "right_elbow", "right_wrist"],
    rules: [
        {
            joint: "left_elbow",
            type: "stability", // Ensure elbow stays close to body/vertical
            relatedJoints: ["left_shoulder", "left_elbow", "left_hip"],
            // For stability, we might check if elbow x is close to shoulder x, or angle is vertical
            // Angle: Shoulder-Elbow-Hip. If arm is vertical, angle is 0 or 180 (depending on implementation).
            // Let's use angle: Shoulder (A), Elbow (B), Vertical Drop (C)?
            // Simplified: Check Shoulder-Elbow-Hip angle. Ideally 0 (elbow straight down).
            idealAngle: 0,
            thresholds: { medium: 15, high: 25 },
            feedback: {
                label: "Left elbow moving",
                action: "Keep left elbow pinned to side"
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
                action: "Keep right elbow pinned to side"
            }
        }
    ]
};
