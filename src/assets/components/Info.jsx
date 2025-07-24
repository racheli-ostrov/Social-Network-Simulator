import React, { useContext } from 'react';
import { UserContext } from '../components/UserContext';
import styles from '../css/Info.module.css';

function Info(props) {
  const { currentUser } = useContext(UserContext);

  function handleCloseInfo() {
    props.setInfo(false);
  }

  return (
    <div className={styles.infoContainer}>
      <p className={styles.x} onClick={handleCloseInfo}>✖️</p>
      <h1>My Information</h1>
      <table className={styles.infoTable}>
        <tbody>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>ID</td>
            <td>{currentUser.id}</td>
          </tr>
          <tr>
            <td>Name</td>
            <td>{currentUser.name}</td>
          </tr>
          <tr>
            <td>Username</td>
            <td>{currentUser.username}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{currentUser.email}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>
              <ul>
                <li>{currentUser.address.street}</li>
                <li>{currentUser.address.city}</li>
                <li>{currentUser.address.zipcode}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>{currentUser.phone}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Info;