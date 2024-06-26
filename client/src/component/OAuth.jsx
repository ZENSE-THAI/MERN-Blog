import React from 'react';
import { Button } from 'flowbite-react';
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'; 
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice'; 
import { useNavigate } from 'react-router-dom';

export const OAuth = () => {
    const dispatch = useDispatch();
    const auth = getAuth(app);
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const resultFromGoogle = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultFromGoogle.user.displayName,
                    email: resultFromGoogle.user.email,
                    googlePhotoUrl: resultFromGoogle.user.photoURL,
                }),
            });
            
            if (!res.ok) {
                throw new Error('Failed to authenticate');
            }

            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            console.error('Error in handleGoogleClick:', error);
        }
    };

    return (
        <Button outline color="light" onClick={handleGoogleClick}>
            <FcGoogle className='w-5 h-5 mr-2' /> Continue with Google
        </Button>
    );
};

export default OAuth;
