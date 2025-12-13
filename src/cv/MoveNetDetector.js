import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

export class MoveNetDetector {
    constructor() {
        this.detector = null;
        this.video = null;
        this.rafId = null;
        this.onPose = null;
    }

    async initialize() {
        await tf.setBackend('webgl');
        await tf.ready();

        const model = poseDetection.SupportedModels.MoveNet;
        const detectorConfig = {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
            enableSmoothing: false // We do our own smoothing
        };
        this.detector = await poseDetection.createDetector(model, detectorConfig);
    }

    async setupCamera(videoElement) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            'audio': false,
            'video': {
                width: 640,
                height: 480,
                facingMode: 'user'
            },
        });

        videoElement.srcObject = stream;
        this.video = videoElement;

        return new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
                videoElement.play();
                resolve(videoElement);
            };
        });
    }

    start(onPoseCallback) {
        this.onPose = onPoseCallback;
        this.loop();
    }

    stop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    async loop() {
        if (this.detector && this.video && this.video.readyState === 4) {
            try {
                const poses = await this.detector.estimatePoses(this.video, {
                    maxPoses: 1,
                    flipHorizontal: false // We mirror via CSS/Canvas context
                });

                if (poses && poses.length > 0) {
                    const pose = poses[0];
                    // Format to our standard
                    const poseFrame = {
                        frameId: Date.now(),
                        timestamp: Date.now(),
                        keypoints: pose.keypoints,
                        width: this.video.videoWidth,
                        height: this.video.videoHeight
                    };

                    if (this.onPose) this.onPose(poseFrame);
                }
            } catch (error) {
                console.error("Pose detection error:", error);
            }
        }

        this.rafId = requestAnimationFrame(() => this.loop());
    }
}
