import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import UserData from '../components/UserData';
import { UserContext } from '../components/UserContext';
import styles from '../css/SignUp.module.css';

function SignUp() {
  const { setCurrentUser } = useContext(UserContext);
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [username, setUsername] = useState('');
  const [sign_up_error, setSign_up_error] = useState('');
  const [signedUp, setSignedUp] = useState(false);
  const [hashedPassword, setHashedPassword] = useState('');

  async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  const handleSignup = async () => {
    if (password !== verifyPassword) {
      setSign_up_error("Passwords don't match");
      return;
    }

    try {
      const hashed = await hashPassword(password);
      setHashedPassword(hashed);

      const response = await fetch(`http://localhost:3000/users/?username=${username}`);
      if (!response.ok) {
        throw new Error("Unable to connect to the server");
      }

      const data = await response.json();
      if (data.length > 0) {
        // const existingUserId = data[0].id;
        // await fetch(`http://localhost:3000/users/${existingUserId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ username, password: hashed })
        setSign_up_error("User already exist!");
        return;
        // });
      } else {
        await fetch(`http://localhost:3000/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password: hashed }),
        });
      }

      setSignedUp(true);
    } catch (error) {
      console.error("SignUp error:", error);
      setSign_up_error("An error occurred");
    }
  };

  return (
    <>
      {!signedUp ? (
        <div className={styles.container}>
          <h1>Sign Up</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Verify Password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
          />
          <p className={styles.sign_up_error}>{sign_up_error}</p>
          <button onClick={handleSignup}>Sign Up</button>
          <Link to="/login" className={styles.link}>Log In</Link>
        </div>
      ) : (
        <UserData
          setCurrentUser={setCurrentUser}
          password={hashedPassword}
          username={username}
          setSignedUp={setSignedUp}
          setSign_up_error={setSign_up_error}
        />
      )}
    </>
  );
}

export default SignUp;
