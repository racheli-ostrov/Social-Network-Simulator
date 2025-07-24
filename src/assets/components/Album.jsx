import React from 'react'
import styles from '../css/Album.module.css'
function Album(props) {
  return (
    <div className={styles.albumContainer}>
      <div><h3>id:{props.currentAlbum.id}</h3></div>
      <div><p>title:{props.currentAlbum.title}</p></div>
    </div>
  )
}

export default Album;