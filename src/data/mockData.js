export const USERS = [
    {
        id: 'user_new',
        name: 'Rahul Kumar',
        avatar: 'https://i.pravatar.cc/150?u=user_new',
        hasConsulted: false,
        report: null
    },
    {
        id: 'user_rehab',
        name: 'Priya Sharma',
        avatar: 'https://i.pravatar.cc/150?u=user_rehab',
        hasConsulted: true,
        report: {
            ptName: 'Dr. Anjali Patil',
            ptContact: '+91 98765 43210',
            date: '2023-12-10',
            diagnosis: 'Bicep Tendonitis (Mild)',
            notes: 'Patient shows signs of inflammation. Recommended isolation exercises with strict form.',
            prescribedExercise: 'bicepCurl',
            prescriptionDetails: '3 sets of 10 reps. Focus on keeping elbows pinned.',
            progress: 35
        }
    }
];

export const PHYSIOTHERAPISTS = [
    {
        id: 1,
        name: 'Dr. Anjali Patil',
        specialty: 'Sports Rehabilitation',
        location: [13.3209, 77.1313], // SIT Main Block area
        address: 'SIT Campus, Tumkur',
        rating: 4.9,
        reviews: 124,
        image: 'https://i.pravatar.cc/150?u=dr_anjali',
        contact: {
            phone: '+91 98765 43210',
            email: 'anjali.p@sit.ac.in'
        }
    },
    {
        id: 2,
        name: 'Dr. Ramesh Gowda',
        specialty: 'Orthopedics',
        location: [13.3300, 77.1280], // Nearby
        address: 'BH Road, Tumkur',
        rating: 4.7,
        reviews: 89,
        image: 'https://i.pravatar.cc/150?u=dr_ramesh',
        contact: {
            phone: '+91 91234 56789',
            email: 'ramesh.ortho@gmail.com'
        }
    },
    {
        id: 3,
        name: 'Siddaganga Physio Center',
        specialty: 'General Physio',
        location: [13.3250, 77.1240], // Nearby
        address: 'Batawadi, Tumkur',
        rating: 4.5,
        reviews: 210,
        image: 'https://i.pravatar.cc/150?u=clinic_sit',
        contact: {
            phone: '+91 80 2233 4455',
            email: 'contact@siddaganga.org'
        }
    }
];
