import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS as DEMO_USERS, PHYSIOTHERAPISTS } from '../data/mockData';



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from session on start (Use SessionStorage for multi-tab support)
    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem('physio_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error("Session storage access error:", e);
        }
        setLoading(false); // Auth check complete
    }, []);

    // Helper: Refresh current user data from DB (for real-time updates)
    const refreshUser = () => {
        if (!user) return;

        try {
            // checking both local and demo
            const localUsers = JSON.parse(localStorage.getItem('physio_users_db') || '[]');
            let updatedUser = localUsers.find(u => u.username === user.username);

            if (!updatedUser) {
                updatedUser = DEMO_USERS.find(u => u.username === user.username);
                // If demo user, we might have overrides in local storage? For now, we assume demo users are static unless we implement deep merge.
                // Actually, for the demo "Consultation Update" to work on User Dashboard, we need to read the latest state.
                // Since we wrote updatePatientPrescription to modify 'physio_users_db' even for demo users (by copying them? No, the previous code updated localUsers findIndex. If demo user wasn't in localUsers, it failed silently? Let's check updatePatientPrescription).
            }

            if (updatedUser) {
                // Only update if data changed to avoid loops, but simple set is fine
                setUser(prev => ({ ...prev, ...updatedUser }));
                sessionStorage.setItem('physio_user', JSON.stringify(updatedUser));
            }
        } catch (e) {
            console.error("Storage refresh error:", e);
        }
    };

    const login = (username, password) => {
        try {
            // 1. Check LocalStorage Users (Real Reg)
            const localUsers = JSON.parse(localStorage.getItem('physio_users_db') || '[]');
            let foundUser = localUsers.find(u => u.username === username && u.password === password);

            // 2. Check Demo Users
            if (!foundUser) {
                foundUser = DEMO_USERS.find(u => u.username === username && (u.password === password || password === 'demo'));

                // CRITICAL FIX: If we log in as a Demo User, we must ensure they exist in 'physio_users_db' so their report can be updated by the PT.
                // If they are not in local DB, copy them there.
                if (foundUser && !localUsers.find(u => u.username === username)) {
                    localUsers.push(foundUser);
                    localStorage.setItem('physio_users_db', JSON.stringify(localUsers));
                }
            }

            if (foundUser) {
                setUser(foundUser);
                // Default role if missing (for old local users)
                if (!foundUser.role) foundUser.role = 'patient';
                sessionStorage.setItem('physio_user', JSON.stringify(foundUser)); // SESSION STORAGE
                return { success: true, role: foundUser.role };
            }
        } catch (e) {
            console.error("Login storage error:", e);
            return { success: false, message: "Storage access denied. Try disabling strict privacy settings." };
        }

        return { success: false, message: "Invalid username or password" };
    };

    const register = (userData) => {
        try {
            const localUsers = JSON.parse(localStorage.getItem('physio_users_db') || '[]');
            if (localUsers.find(u => u.username === userData.username)) {
                return { success: false, message: "Username already taken" };
            }

            const newUser = {
                id: 'u_' + Date.now(),
                name: userData.name,
                username: userData.username,
                password: userData.password,
                role: 'patient', // Default new registers are patients
                avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=random`,
                hasConsulted: false,
                report: null
            };

            localUsers.push(newUser);
            localStorage.setItem('physio_users_db', JSON.stringify(localUsers));
            return { success: true };
        } catch (e) {
            console.error("Register storage error:", e);
            return { success: false, message: "Storage access denied." };
        }
    };

    // PT Helper: Get All Patients (For Demo/Admin PT)
    const getAllPatients = () => {
        if (!user || user.role !== 'physio') return [];

        try {
            // Return ALL patients from Demo and Local Storage
            const demoPatients = DEMO_USERS.filter(u => u.role === 'patient');
            const localUsers = JSON.parse(localStorage.getItem('physio_users_db') || '[]');

            // Deduplicate by Username (Local takes priority)
            const patientMap = new Map();

            // 1. Add Demo Patients
            demoPatients.forEach(p => patientMap.set(p.username, p));

            // 2. Add/Overwrite with Local Patients
            localUsers.forEach(u => {
                if (u.role === 'patient') {
                    patientMap.set(u.username, u);
                }
            });

            return Array.from(patientMap.values());
        } catch (e) {
            console.error("Get patients storage error:", e);
            return DEMO_USERS.filter(u => u.role === 'patient');
        }
    };

    // PT Helper: Update Patient Prescription
    const updatePatientPrescription = (patientId, newExercise, newNotes) => {
        // We need to update the patient in whichever DB they exist (Demo or Local)
        // Since we can't edit the const file, we'll simulate it by updating a "Overrides" object in localStorage
        // OR simpler: Just rely on React State in the demo if it was checking a real DB. 
        // Ideally, we'd update 'physio_users_db'.
        try {
            const localUsers = JSON.parse(localStorage.getItem('physio_users_db') || '[]');

            // Try to find by ID
            let localIdx = localUsers.findIndex(u => u.id === patientId);

            // If not found (maybe it's a raw demo user), try to find by username/id from demo and add it
            if (localIdx === -1) {
                const demoUser = DEMO_USERS.find(u => u.id === patientId);
                if (demoUser) {
                    // Critical: Deep clone to avoid mutating constant reference
                    localUsers.push(JSON.parse(JSON.stringify(demoUser)));
                    localIdx = localUsers.length - 1;
                }
            }

            if (localIdx !== -1) {
                // Update Local User
                if (!localUsers[localIdx].report) localUsers[localIdx].report = {};
                localUsers[localIdx].report.prescribedExercise = newExercise;
                localUsers[localIdx].report.notes = newNotes;

                // Get Rich PT Details
                const richPT = PHYSIOTHERAPISTS.find(p => p.name === user.name);
                const contact = richPT?.contact?.phone || richPT?.contact?.email || user.email || "Contact Clinic";

                localUsers[localIdx].report.ptName = user.name || "Unknown PT";
                localUsers[localIdx].report.ptContact = contact;

                // Ensure Date and Diagnosis exist
                if (!localUsers[localIdx].report.date) {
                    localUsers[localIdx].report.date = new Date().toISOString().split('T')[0];
                }
                if (!localUsers[localIdx].report.diagnosis) {
                    localUsers[localIdx].report.diagnosis = "Assessment Pending";
                }

                localUsers[localIdx].hasConsulted = true; // Mark as consulted

                localStorage.setItem('physio_users_db', JSON.stringify(localUsers));
                console.log("Prescription Saved:", localUsers[localIdx]); // DEBUG
                localStorage.setItem('physio_users_db', JSON.stringify(localUsers));
                console.log("Prescription Saved:", localUsers[localIdx]); // DEBUG
                return true;
            }
        } catch (e) {
            console.error("Update prescription storage error:", e);
        }
        return false;
    };

    // User Helper: Send Session to PT
    const sendSessionToPT = (sessionData) => {
        if (!user) return false;
        try {
            const localUsers = JSON.parse(localStorage.getItem('physio_users_db') || '[]');
            const idx = localUsers.findIndex(u => u.username === user.username);

            if (idx !== -1) {
                if (!localUsers[idx].report) localUsers[idx].report = {};
                localUsers[idx].report.lastSession = sessionData;
                localUsers[idx].report.lastSessionDate = new Date().toISOString();

                localStorage.setItem('physio_users_db', JSON.stringify(localUsers));
                return true;
            }
        } catch (e) {
            console.error("Send to PT error:", e);
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('physio_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, getAllPatients, updatePatientPrescription, sendSessionToPT, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
