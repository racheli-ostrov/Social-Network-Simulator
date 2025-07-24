import React, { useState, useEffect, useContext } from 'react';
import Album from '../components/Album';
import styles from '../css/Albums.module.css';
import { Link } from 'react-router-dom';
import { UserContext } from '../components/UserContext';

function Albums({setInfo}) {
  const { currentUser } = useContext(UserContext);
  const [albums, setAlbums] = useState({ allAlbums: [], albumsOnScreen: [] });
  const [searchInput, setSearchInput] = useState('');
  const [add, setAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [editingAlbum, setEditingAlbum] = useState(null);

  useEffect(() => {
    setInfo(false);
    fetch(`http://localhost:3000/users/${currentUser.id}/albums`)
      .then((response) => response.json())
      .then((albums) => {
        setAlbums({ allAlbums: albums, albumsOnScreen: albums });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentUser.id, setInfo]);

  function showAdd() {
    setAdd(true);
  }

  function handleSearchInputChange(event) {
    setSearchInput(event.target.value);
  }

  function searchAlbums() {
    if (searchInput.trim() === '') {
      setAlbums({ ...albums, albumsOnScreen: albums.allAlbums });
    } else {
      const searchTerm = searchInput.toLowerCase().trim();
      const filteredAlbums = albums.allAlbums.filter(
        (album) =>
          album.id.toString().includes(searchTerm) ||
          album.title.toLowerCase().includes(searchTerm)
      );
      setAlbums({ ...albums, albumsOnScreen: filteredAlbums });
    }
  }

  function handleAdd() {
    const newAlbumData = {
      title,
      userId: currentUser.id,
    };
    fetch('http://localhost:3000/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAlbumData),
    })
      .then((response) => response.json())
      .then((newAlbum) => {
        setAlbums({
          allAlbums: [...albums.allAlbums, newAlbum],
          albumsOnScreen: [...albums.albumsOnScreen, newAlbum],
        });
        setAdd(false);
        setTitle('');
      })
      .catch((error) => console.error('Error creating album:', error));
  }

  function handleEdit(album) {
    setEditingAlbum(album);
    setTitle(album.title);
  }

  function handleSaveEdit() {
    const updatedAlbum = { ...editingAlbum, title };
    fetch(`http://localhost:3000/albums/${editingAlbum.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedAlbum),
    })
      .then((response) => response.json())
      .then((updated) => {
        const updatedAlbums = albums.allAlbums.map((album) =>
          album.id === updated.id ? updated : album
        );
        setAlbums({ allAlbums: updatedAlbums, albumsOnScreen: updatedAlbums });
        setEditingAlbum(null);
      })
      .catch((error) => console.error('Error saving album edit:', error));
  }

  function handleDelete(id) {
    fetch(`http://localhost:3000/albums/${id}`, { method: 'DELETE' })
      .then(() => {
        const updatedAlbums = albums.allAlbums.filter((album) => album.id !== id);
        setAlbums({ allAlbums: updatedAlbums, albumsOnScreen: updatedAlbums });
      })
      .catch((error) => console.error('Error deleting album:', error));
  }

  return (
    <div>
      <div className={styles.albumsActions}>
        <button onClick={showAdd} className={styles.addButton}>➕</button>
        {add && (
          <div className={styles.add}>
            <input
              type="text"
              value={title}
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              className={styles.inputEdit}
            />
            <button className={styles.addButton} onClick={handleAdd}>✔</button>
            <button className={styles.addButton} onClick={() => setAdd(false)}>❌</button>
          </div>
        )}
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search by ID or Title 🎙️ ✅"
            value={searchInput}
            onChange={handleSearchInputChange}
            className={styles.input}
          />
          <button className={styles.button} onClick={searchAlbums}>🔎</button>
        </div>
      </div>

      {albums.albumsOnScreen.length === 0 && searchInput && (
        <p className={styles.noResults}>No albums found matching your search 🤷‍♂️</p>
      )}

      <div className={styles.albumsContainer}>
        {albums.albumsOnScreen.map((a) => (
          <div key={a.id} className={styles.album}>
            <Link
              className={styles.link}
              to={`/home/users/${currentUser.id}/albums/${a.id}/photos`}
            >
              <Album currentAlbum={a} />
            </Link>
            {editingAlbum && editingAlbum.id === a.id ? (
              <div className={styles.editContainer}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.input}
                />
                <div className={styles.actions}>
                  <button
                    className={styles.albumsButton}
                    onClick={() => setEditingAlbum(null)}
                  >
                    ❌
                  </button>
                  <button
                    className={styles.albumsButton}
                    onClick={handleSaveEdit}
                  >
                    ✔
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.actions}>
                <button
                  onClick={() => handleDelete(a.id)}
                  className={styles.editAlbumsButton}
                >
                  ❌
                </button>
                <button
                  onClick={() => handleEdit(a)}
                  className={styles.editAlbumsButton}
                >
                  ✏️
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Albums;