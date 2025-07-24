import React, { useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import styles from '../css/UserData.module.css';

const UserData = (props) => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const phoneRef = useRef();
  const emailRef = useRef();
  const nameRef = useRef();
  const streetRef = useRef();
  const cityRef = useRef();
  const zipCodeRef = useRef();

  const userId = JSON.parse(localStorage.getItem('currentUser'))?.id;

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:3000/users/${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error fetching user data");
          }
          return response.json();
        })
        .then((user) => {
          setCurrentUser(user);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [userId, setCurrentUser]);

  function handleSubmit(event) {
    event.preventDefault();

    const userData = {
      name: nameRef.current.value,
      username: props.username,
      email: emailRef.current.value,
      address: {
        street: streetRef.current.value,
        city: cityRef.current.value,
        zipcode: zipCodeRef.current.value,
      },
      phone: phoneRef.current.value,
      password: props.password,
    };

    fetch(`http://localhost:3000/users/?username=${userData.username}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error checking user existence");
        }
        return response.json();
      })
      .then((existingUsers) => {
        if (existingUsers.length > 0) {
          const existingUserId = existingUsers[0].id;
          return fetch(`http://localhost:3000/users/${existingUserId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
        } else {
          return fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
        }
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error updating or creating user");
        }
        return response.json();
      })
      .then((response) => {
        setCurrentUser(response);
        localStorage.setItem('currentUser', response.id);
    navigate('/home');
  })
      .catch ((error) => {
  console.error('Error handling user data:', error);
});
  }

return (
  <div className={styles.container}>
    <h2>User Information Form</h2>
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="text" ref={emailRef} required />
      </label>
      <label>
        Name:
        <input type="text" ref={nameRef} required />
      </label>
      <label>
        Street:
        <input type="text" ref={streetRef} required />
      </label>
      <label>
        City:
        <input type="text" ref={cityRef} required />
      </label>
      <label>
        ZipCode:
        <input type="text" ref={zipCodeRef} required />
      </label>
      <label>
        Phone:
        <input type="tel" ref={phoneRef} required />
      </label>
      <button type="submit">Sign Up</button>
    </form>
  </div>
);
};

export default UserData;
