import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {auth} from '../../services/firebase';
import {signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import {initializeAmplitude, logEvent, setAmplitudeUserId, setAmplitudeUserProperties} from "../../services/amplitude";

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        const userToken = localStorage.getItem('userToken');
        initializeAmplitude();

        if (userEmail && userToken) {
            setAmplitudeUserId(userToken);
            logEvent('Login');
            navigate('/home');
        }
    }, [navigate]);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let userEmail = user.email || '';
            localStorage.setItem('userEmail', userEmail);
            let userToken = await user.getIdToken();
            localStorage.setItem('userToken', userToken);

            setAmplitudeUserId(userToken);
            setAmplitudeUserProperties({
              email: userEmail,
            });
            logEvent('Login');
            navigate('/home');
        } catch (err: any) {
            setError(err.message);
            logEvent('Login', {message: err.message});
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Save user email and token in local storage
            localStorage.setItem('userEmail', user.email || '');
            localStorage.setItem('userToken', await user.getIdToken());

            console.log('Google Login successful', user);
            navigate('/home'); // Navigate to home after successful login
        } catch (err: any) {
            setError(err.message);
            console.error('Google Login error:', err);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputContainer}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.inputContainer}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        style={styles.input}
                        required
                    />
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>Login</button>
            </form>
            <button onClick={handleGoogleSignIn} style={styles.googleButton}>Sign in with Google</button>
        </div>
    );
}

// Basic styles for the component
const styles = {
    container: {
        width: '300px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as 'column',
    },
    inputContainer: {
        marginBottom: '15px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        width: '100%',
        boxSizing: 'border-box' as 'border-box',
    },
    button: {
        padding: '10px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        marginTop: '10px',
    },
    googleButton: {
        padding: '10px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#4285F4',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        marginTop: '10px',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
};

export default LoginScreen;
