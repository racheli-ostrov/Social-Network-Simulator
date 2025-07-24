import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import styles from '../css/Login.module.css';

function LogIn() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [log_in_error, setLog_in_error] = useState('');
    const navigate = useNavigate();
    const { setCurrentUser } = useContext(UserContext);

    async function hashPassword(password) {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    const handleLogin = async () => {
        try {
            const hashedInputPassword = await hashPassword(password);

            const response = await fetch(`http://localhost:3000/users?username=${userName}`);

            if (!response.ok) {
                setLog_in_error("Invalid data");
                throw new Error("Invalid data");
            }

            const users = await response.json();
            if (users.length === 0) {
                setLog_in_error("User not found!");
                return;
            }

            const user = users[0];

            if (user.password === hashedInputPassword) {
                localStorage.setItem('currentUser', user.id);
                setCurrentUser(user);
                navigate('/home');
            } else {
                setLog_in_error("Incorrect password!");
            }
        } catch (error) {
            console.error('Login error:', error);
            setLog_in_error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="UserName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <p className={styles.log_in_error}>{log_in_error}</p>
            <button onClick={handleLogin}>Login</button>
            <Link to="/register" className={styles.link}>Sign Up</Link>
        </div>
    );
}

export default LogIn;
