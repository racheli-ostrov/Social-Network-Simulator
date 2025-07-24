import { useState } from 'react';
import './App.css';
import LogIn from './assets/pages/LogIn';
import SignUp from './assets/pages/SignUp';
import Home from './assets/pages/Home';
import ToDos from './assets/pages/ToDos';
import Albums from './assets/pages/Albums';
import Posts from './assets/pages/Posts';
import { BrowserRouter as Router,Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './assets/components/NavBar';
import Photos from './assets/pages/Photos';
import NotFound from './assets/pages/NotFound';
import { UserProvider } from '../src/assets/components/UserContext';

function App() {
  const [info, setInfo] = useState(false);

  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route
          path="/home"
          element={<NavBar info={info} setInfo={setInfo} className="nav" />}
        >
          <Route index element={<Home setInfo={setInfo} info={info} />} />
          <Route path="users/:id/todos" element={<ToDos setInfo={setInfo} />} />
          <Route path="users/:id/albums" element={<Albums setInfo={setInfo} />} />
          <Route path="users/:id/albums/:id/photos" element={<Photos />} />
          <Route path="users/:id/posts" element={<Posts setInfo={setInfo} />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
