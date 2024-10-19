import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { setAmplitudeUserId, logEvent } from '../../services/amplitude'; // Adjust as needed for amplitude services

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Call useNavigate at the top level

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        const auth = getAuth();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userEmail = user.email || '';
            localStorage.setItem('userEmail', userEmail);
            const token = await user.getIdToken();
            localStorage.setItem('userToken', token);

            setAmplitudeUserId(token); // Set Amplitude user ID if applicable
            logEvent('Register'); // Log registration event if applicable

            navigate('/home'); // Navigate to the home page after successful registration
        } catch (error: any) {
            setError(error.message);
            console.error('Error registering user:', error.message);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
