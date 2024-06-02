import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebase_auth } from '@/config/firebaseConfig';


export default function useAuth() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const unsub = onAuthStateChanged(firebase_auth, user => {

            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return unsub;
    }, [])
    return {user};
}