import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import Photo from '../components/Photo';
import PhotoForm from '../components/PhotoForm';
import styles from '../css/Photos.module.css'

function Photos() {
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [add, setAdd] = useState(false);
  const [loadMore, setLoadMore] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/albums/${id}/photos?_page=${page}&_limit=10`);
        const data = await response.json();
        
        if (data.length === 0) {
          setLoadMore(false);
        }
        
        if (page === 1) {
          setPhotos(data);
        } else {
          setPhotos(prevPhotos => [...prevPhotos, ...data]);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhotos();
  }, [id, page]);

  const handleLoadPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleAdd = async (photoData) => {
    try {
      setPhotos(prevPhotos => [photoData, ...prevPhotos]);
      setAdd(false);
    } catch (error) {
      console.error('Error adding photo:', error);
      alert('Failed to add photo. Please try again.');
    }
  };

  return (
    <div>
      <h2>Photos for Album {id}</h2>
      <button className={styles.photosButton} onClick={() => setAdd(true)}>
        ➕
      </button>
      {add && (
        <div>
          <PhotoForm
            setAdd={setAdd}
            onSubmit={handleAdd}
            currentAlbumId={id}
          />
        </div>
      )}
      <div className={styles.photosContainer}>
        {photos.map((photo) => (
          <Photo
            key={photo.id}
            currentAlbum={id}
            currentPhoto={photo}
            setPhotos={setPhotos}
            photos={photos}
          />
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {loadMore && <button className={styles.loadPhotoes} onClick={handleLoadPage}>Load More Photos</button>}
      {!loadMore && <h4>no more photos yet ☹️</h4>}
    </div>
  );
}

export default Photos;
