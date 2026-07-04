import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS as DEMO_USERS, PHYSIOTHERAPISTS } from '../data/mockData';



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // load user from session on start (use sessionstorage for multi-tab support)
    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem('physio_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error("Session storage access error:", e);
        }
        setLoading(false); // auth check complete
    }, []);

    // helper: refresh current user data from db (for real-time updates)
    const refreshUser = () => {
        if (!user) return;

        try {
            // checking both local and demo
            const localUsers = JSON.parse(localStorage.getItem('physio_users_db') || '[]');
            let updatedUser = localUsers.find(u => u.username === user.username);

            if (!updatedUser) {
                updatedUser = DEMO_USERS.find(u => u.username === user.username);
                // if demo user, we might have overrides in local storage? for now, we assume demo users are static unless we implement deep merge.
                // actually, for the demo "consultation update" to work on user dashboard, we need to read the latest state.
                // since we wrote updatepatientprescription to modify 'physio_users_db' even for demo users (by copying them? no, the previous code updated localusers findindex. if demo user wasn't in localusers, it failed silently? let's check updatepatientprescription).
            }

            if (updatedUser) {
                // only update if data changed to avoid loops, but simple set is fine
                setUser(prev => ({ ...prev, ...updatedUser }));
                sessionStorage.setItem('physio_user', JSON.stringify(updatedUser));
            }
        } catch (e) {
            console.error("Storage refresh error:", e);
        }
    };

    const login = (username, password) => {
        try {
            // 1. check localstorage users (real reg)
            const localUsers = JSON.parse(localStorage.getItem('physio_users_db') || '[]');
            let foundUser = localUsers.find(u => u.username === username && u.password === password);

            // 2. check demo users
            if (!foundUser) {
                foundUser = DEMO_USERS.find(u => u.username === username && (u.password === password || password === 'demo'));

                // critical fix: if we log in as a demo user, we must ensure they exist in 'physio_users_db' so their report can be updated by the pt.
                // if they are not in local db, copy them there.
                if (foundUser && !localUsers.find(u => u.username === username)) {
                    localUsers.push(foundUser);
                    localStorage.setItem('physio_users_db', JSON.stringify(localUsers));
                }
            }

            if (foundUser) {
                setUser(foundUser);
                // default role if missing (for old local users)
                if (!foundUser.role) foundUser.role = 'patient';
                sessionStorage.setItem('physio_user', JSON.stringify(foundUser)); // session storage
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
                role: 'patient', // default new registers are patients
                avatar: `https://ui-avatars.com/api/?name=${userdata.name}&background=random`,
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

    // pt helper: get all patients (for demo/admin pt)
    const getAllPatients = () => {
        if (!user || user.role !== 'physio') return [];

        try {
            // return all patients from demo and local storage
            const demoPatients = DEMO_USERS.filter(u => u.role === 'patient');
            const localUsers = JSON.parse(localStorage.getItem('physio_users_db') || '[]');

            // deduplicate by username (local takes priority)
            const patientMap = new Map();

            // 1. add demo patients
            demoPatients.forEach(p => patientMap.set(p.username, p));

            // 2. add/overwrite with local patients
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

    // pt helper: update patient prescription
    const updatePatientPrescription = (patientId, newExercise, newNotes) => {
        // we need to update the patient in whichever db they exist (demo or local)
        // since we can't edit the const file, we'll simulate it by updating a "overrides" object in localstorage
        // or simpler: just rely on react state in the demo if it was checking a real db.
        // ideally, we'd update 'physio_users_db'.
        try {
            const localUsers = JSON.parse(localStorage.getItem('physio_users_db') || '[]');

            // try to find by id
            let localIdx = localUsers.findIndex(u => u.id === patientId);

            // if not found (maybe it's a raw demo user), try to find by username/id from demo and add it
            if (localIdx === -1) {
                const demoUser = DEMO_USERS.find(u => u.id === patientId);
                if (demoUser) {
                    // critical: deep clone to avoid mutating constant reference
                    localUsers.push(JSON.parse(JSON.stringify(demoUser)));
                    localIdx = localUsers.length - 1;
                }
            }

            if (localIdx !== -1) {
                // update local user
                if (!localUsers[localIdx].report) localUsers[localIdx].report = {};
                localUsers[localIdx].report.prescribedExercise = newExercise;
                localUsers[localIdx].report.notes = newNotes;

                // get rich pt details
                const richPT = PHYSIOTHERAPISTS.find(p => p.name === user.name);
                const contact = richPT?.contact?.phone || richPT?.contact?.email || user.email || "Contact Clinic";

                localUsers[localIdx].report.ptName = user.name || "Unknown PT";
                localUsers[localIdx].report.ptContact = contact;

                // ensure date and diagnosis exist
                if (!localUsers[localIdx].report.date) {
                    localUsers[localIdx].report.date = new Date().toISOString().split('T')[0];
                }
                if (!localUsers[localIdx].report.diagnosis) {
                    localUsers[localIdx].report.diagnosis = "Assessment Pending";
                }

                localUsers[localIdx].hasConsulted = true; // mark as consulted

                localStorage.setItem('physio_users_db', JSON.stringify(localUsers));
                console.log("Prescription Saved:", localUsers[localIdx]); // debug
                localStorage.setItem('physio_users_db', JSON.stringify(localUsers));
                console.log("Prescription Saved:", localUsers[localIdx]); // debug
                return true;
            }
        } catch (e) {
            console.error("Update prescription storage error:", e);
        }
        return false;
    };

    // user helper: send session to pt
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
