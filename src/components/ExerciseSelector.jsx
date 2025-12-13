import React from 'react';
import { setExercise } from '../state/globalState';

const EXERCISES = [
    { id: 'squat', name: 'Squat (Legs)' },
    { id: 'bicepCurl', name: 'Bicep Curl (Arms)' },
    { id: 'shoulderPress', name: 'Shoulder Press (Shoulders)' }
];

const ExerciseSelector = ({ current, onChange }) => {
    const handleChange = (e) => {
        const newVal = e.target.value;
        setExercise(newVal);
        onChange(newVal);
    };

    return (
        <div style={styles.container}>
            <label style={styles.label}>Active Workout:</label>
            <select value={current} onChange={handleChange} style={styles.select}>
                {EXERCISES.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
            </select>
        </div>
    );
};

const styles = {
    container: {
        marginBottom: '16px',
        backgroundColor: '#333',
        padding: '10px 16px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        pointerEvents: 'auto' // ensure clickable
    },
    label: {
        fontWeight: '600',
        color: '#ddd',
        fontSize: '0.9rem'
    },
    select: {
        padding: '8px 12px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#444',
        color: 'white',
        fontSize: '0.9rem',
        cursor: 'pointer',
        outline: 'none'
    }
};

export default ExerciseSelector;
