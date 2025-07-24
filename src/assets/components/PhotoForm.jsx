import React, { useState } from 'react';
import styles from '../css/PhotoForm.module.css';

function PhotoForm({ onSubmit, setAdd, currentAlbumId }) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    thumbnailUrl: '',
    albumId: currentAlbumId
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const photoData = {
      ...formData,
      albumId: parseInt(currentAlbumId)
    };

    try {
      const response = await fetch('http://localhost:3000/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(photoData),
      });

      if (!response.ok) {
        throw new Error('Failed to save photo');
      }

      const savedPhoto = await response.json();
      onSubmit(savedPhoto);
    } catch (error) {
      console.error('Error saving photo:', error);
      alert('Failed to save photo. Please try again.');
    }
  };

  return (
    <div className={styles.form}>
      <button className={styles.inputButton} onClick={() => setAdd(false)}>✖️</button>
      <h2>Enter Photo Information</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input 
            className={styles.input} 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <label>
          URL:
          <input 
            className={styles.input} 
            type="url" 
            name="url" 
            value={formData.url} 
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <label>
          Thumbnail URL:
          <input 
            className={styles.input} 
            type="url" 
            name="thumbnailUrl" 
            value={formData.thumbnailUrl} 
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <button className={styles.inputsButton} type="submit">➕</button>
      </form>
    </div>
  );
}

export default PhotoForm;