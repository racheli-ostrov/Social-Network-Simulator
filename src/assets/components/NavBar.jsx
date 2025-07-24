import React, { useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import styles from '../css/NavBar.module.css';

function NavBar(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  function handleLogOut() {
    localStorage.clear();
    setCurrentUser(null);
    navigate('/login');
  }

  function handleInfo() {
    navigate('/home');
    props.setInfo((info) => !info);
  }

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles['navbar-links']}>
          <Link to={`users/${currentUser.id}/posts`} className={location.pathname === `users/${currentUser.id}/posts` ? styles.active : ''}>
            Posts
          </Link>
          <Link to={`users/${currentUser.id}/albums`} className={location.pathname === `users/${currentUser.id}/albums` ? styles.active : ''}>
            Albums
          </Link>
          <Link to={`users/${currentUser.id}/todos`} className={location.pathname === `users/${currentUser.id}/todos` ? styles.active : ''}>
            ToDos
          </Link>
          <button className={styles.infoNavBar} onClick={handleInfo}>Info</button>
        </div>
        <div>
          Hello, {currentUser.name}
          <div>🗣️ 🖤 🤝</div>
        </div>
        <button className={styles['logout-btn']} onClick={handleLogOut}>
          Log Out
        </button>
      </div>
      <Outlet />
    </>
  );
}

export default NavBar;
