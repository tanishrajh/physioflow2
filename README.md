# PhysioFlow 

PhysioFlow is a web-based physical therapy application designed to facilitate remote, at-home rehabilitation. Utilizing in-browser computer vision, the platform tracks human pose in real-time, providing immediate biomechanical feedback and accurate repetition counting. All processing occurs locally on the client device, ensuring complete data privacy.

## Core Features

*   **Real-Time Biomechanical Feedback**: Analyzes joint angles during exercises and provides immediate corrective instructions (e.g., "Keep your elbow pinned").
*   **Smart Rep Counting**: Utilizes state machine logic to ensure repetitions are only counted upon full range of motion completion.
*   **Form Scoring**: Evaluates structural posture throughout the exercise to assign a quantifiable performance score.
*   **Tempo Tracking**: Monitors eccentric and concentric movement speeds to prevent rushing.
*   **Automated Progress Reports**: Generates comprehensive PDF performance reports post-session.
*   **Clinic Discovery**: Integrates a localized mapping system to help users locate nearby physical therapy clinics.

## Technology Stack

*   **Frontend Architecture**: React.js and Vite
*   **Computer Vision**: TensorFlow.js (MoveNet Thunder) running strictly client-side
*   **Performance Optimization**: Web Workers (offloading processing logic) and OneEuroFilter (smoothing coordinate jitter)
*   **State Management**: React Context API
*   **Additional Libraries**: jsPDF (report generation), React-Leaflet (mapping)

## Local Development Setup

### Prerequisites
Node.js (version 16 or higher) is required.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/tanishrajh/Physioflow2.git
    cd physioflow2
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Initialize the development server:
    ```bash
    npm run dev
    ```

4.  Navigate to `http://localhost:5173` in a web browser. Note: Camera permissions must be granted for the pose estimation model to initialize.

## Application Modes

PhysioFlow supports distinct user workflows:

### 1. Patient Mode (Demo: Priya)
Patients can access prescribed exercise regimens. Upon initiating a session, the application provides real-time visual and auditory guidance, enforcing proper form and compiling a post-session analytical report.

### 2. Physiotherapist Mode (Demo: Dr. Anjali)
Clinicians are provided a management dashboard to monitor patient adherence, review performance metrics across specific exercises, and assign new rehabilitative routines.

### 3. Discovery Mode
New users default to a discovery interface, featuring an interactive map to locate nearby in-person clinical facilities.

## Architectural Implementation

The pose tracking pipeline operates via the following sequence:
1.  **Inference**: The client webcam stream is processed by the MoveNet model via TensorFlow.js, extracting 17 distinct anatomical keypoints.
2.  **Filtering**: Raw coordinate data is passed through a OneEuroFilter algorithm to mitigate inherent model jitter.
3.  **Calculation**: A dedicated Web Worker calculates scalar joint angles (e.g., elbow flexion) in real-time to prevent main-thread blocking.
4.  **Evaluation**: The calculated angles are evaluated against predefined exercise heuristic rules. Deviations trigger immediate state changes and user feedback.

## Future Roadmap
*   Implementation of a persistent backend database for cross-device data synchronization.
*   Integration of WebRTC for live, remote clinician monitoring.
*   Wearable API integration (e.g., Apple Watch) for supplementary biometric tracking (heart rate).

---
*Developed by [Tanishraj H](https://www.linkedin.com/in/tanishrajh/)*
