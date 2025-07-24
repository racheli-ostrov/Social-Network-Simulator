import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import styles from '../css/Photo.module.css';

function Photo({ currentPhoto, photos, setPhotos }) {
  const { currentUser } = useContext(UserContext);
  const [edit, setEdit] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(currentPhoto.title);

  function handleEdit() {
    const updatedPhoto = {
      albumId: currentPhoto.albumId,
      id: currentPhoto.id,
      title: updatedTitle,
      url: currentPhoto.url,
      thumbnailUrl: currentPhoto.thumbnailUrl,
    };

    fetch(`http://localhost:3000/photos/${currentPhoto.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPhoto),
    })
      .then((response) => response.json())
      .then((updatedPhoto) => {
        const newPhotosArray = photos.map((obj) => {
          if (obj.id === currentPhoto.id) {
            obj.title = updatedPhoto.title;
          }
          return obj;
        });
        setPhotos(newPhotosArray);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    setEdit(false);
  }

  function handleEditForm() {
    setEdit(!edit);
  }

  function handleDelete() {
    fetch(`http://localhost:3000/photos/${currentPhoto.id}`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to delete the photo.');
        }
      })
      .then(() => {
        const newPhotosArray = photos.filter((obj) => obj.id !== currentPhoto.id);
        setPhotos(newPhotosArray);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <div className={styles.photoContainer}>
      <p>{currentPhoto.title}</p>
      <img className={styles.img} key={currentPhoto.id} src={currentPhoto.thumbnailUrl} alt={currentPhoto.title} />
      <div>
        <button onClick={handleDelete} className={styles.photograpyutton}>
          🗑️
        </button>
        <button onClick={handleEditForm} className={styles.photograpyutton}>
          {edit ? '❌' : '🖊️'}
        </button>
      </div>
      {edit && (
        <div>
          <label>
            <input
              className={styles.labelInputButton}
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
          </label>
          <button onClick={handleEdit} className={styles.editButton}>
            ✔
          </button>
        </div>
      )}
    </div>
  );
}

export default Photo;
