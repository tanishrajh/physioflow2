# PhysioFlow 🧘‍♂️💪
> **AI-Powered Real-Time Physiotherapy Assistant**

PhysioFlow is a cutting-edge web application designed to democratize physiotherapy. Using advanced computer vision (**MoveNet**) directly in the browser, it provides real-time feedback, rep counting, and detailed performance analysis to help patients recover faster and safer from the comfort of their homes.


## 🚀 Key Features

*   **🤖 Real-Time AI Guidance**: tailored voice and text feedback (e.g., "Lower Slowly", "Keep elbow pinned", "Leaning back") corrects your form instantly.
*   **🔢 Smart Rep Counter**: A state-machine-based counter that only tracks *successful* reps with full range of motion.
*   **📉 Dynamic Accuracy Scoring**: Frame-by-frame analysis gives you a precise "Good Form" score, not just a generic rating.
*   **⏱️ Tempo Tracking**: Monitors the speed of your reps (eccentric/concentric) to ensure optimal time-under-tension.
*   **🏥 Medical-Grade Reports**: Generates detailed **PDF Reports** with stability scores, range of motion metrics, and automated physiotherapist assessments.
*   **📍 Clinic Discovery**: Integrated map to find and contact nearby physiotherapy clinics (centered on SIT Tumkur).
*   **📅 Progress Tracking**: Local history of all your sessions to visualize your recovery journey.

## 🛠️ Tech Stack

*   **Frontend**: React.js, Vite
*   **Computer Vision**: TensorFlow.js (MoveNet Thunder) - *Runs 100% Client-Side for Privacy*
*   **Performance**: Web Workers (Offload AI processing), OneEuroFilter (Signal Smoothing)
*   **State Management**: React Context API
*   **Reporting**: jsPDF
*   **Mapping**: React-Leaflet
*   **Styling**: Pure CSS (Modern Design System)

## ⚡ Getting Started

### Prerequisites
*   Node.js (v16+)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/tanishrajh/Physioflow2.git
    cd physioflow
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:5173` in your browser. (Allow Camera Access)

## 📖 Usage Guide

PhysioFlow has two main modes:

### 1. Rehab Mode (Patient: Priya)
*   **Login**: Select "Priya (Patient)" from the demo links or register a new account.
*   **Dashboard**: View your prescribed exercise (e.g., Bicep Curl) and recent history.
*   **Start Session**:
    *   Stand in frame.
    *   Follow the **"Guidance"** text (e.g., "CURL UP").
    *   Watch the **Rep Counter** and **Tempo** timer.
    *   Receive feedback on **Elbow Stability** and **Shoulder Symmetry**.
*   **Report**: End the session to see your accuracy and download a PDF report.

### 2. Physiotherapist Mode (Dr. Anjali)
*   **Login**: Select "Dr. Anjali (Physio)" from the demo links.
*   **PT Dashboard**:
    *   **Patient List**: View all registered and demo patients.
    *   **Management**: Click a patient to view their session history, accuracy trends, and issues.
    *   **Prescription**: Assign new exercises (Squat, Shoulder Press) and write consultation notes.
    *   **Remote Monitoring**: Updates are instantly reflected on the patient's dashboard.

### 3. Discovery Mode (New User)
*   **Register**: Create a new account.
*   **Dashboard**: By default, new users start in Discovery Mode to find clinics.
*   **Map**: Interactive map centered on SIT Tumkur to locate nearby specialists.

## 🧠 How It Works (Architecture)

1.  **Video Stream**: Your webcam feed is captured securely in the browser.
2.  **Pose Extraction**: **MoveNet** detects 17 key human joints (shoulders, elbows, hips, etc.) at 30+ FPS.
3.  **Signal Smoothing**: Raw data is filtered using the **OneEuroFilter** to remove camera jitter.
4.  **Geometry Engine**: A dedicated **Web Worker** calculates joint angles and tracks biomechanics in real-time.
5.  **Feedback Logic**:
    *   **State Machine**: Tracks movement phases (Extension vs. Flexion).
    *   **Rules Engine**: Checks against defined thresholds (e.g., "Elbow angle > 25° deviation").
6.  **UI Update**: The main thread renders the skeletal overlay and feedback panels instantly.

## 🔮 Future Scope

*   **Cloud Backend**: Sync history across devices (Firebase/PostgreSQL).
*   **Tele-Rehab**: Live video calls with physiotherapists during sessions.
*   **Wearable Sync**: Integration with Apple Watch/Fitbit for heart rate data.
*   **AR Glasses Support**: Verify form via Heads-Up Display.



---
*Built with ❤️ by [Tanishraj H](https://www.linkedin.com/in/tanishrajh/)*
