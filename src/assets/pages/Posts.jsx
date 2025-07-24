import React, { useEffect, useState, useContext } from 'react';
import Post from '../components/Post';
import styles from '../css/Posts.module.css';
import PostForm from '../components/PostForm';
import { UserContext } from '../components/UserContext';

function Posts({ setInfo}) {
  const { currentUser } = useContext(UserContext); 
  const [posts, setPosts] = useState({ allPosts: [], postsOnScreen: [] });
  const [popPost, setPopPost] = useState(false);
  const [add, setAdd] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showingAllPosts, setShowingAllPosts] = useState(false); 

  useEffect(() => {
    setInfo(false);
    fetchUserPosts();
  }, [setInfo]);

  function fetchUserPosts() {
    fetch(`http://localhost:3000/users/${currentUser.id}/posts`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user posts");
        }
        return response.json();
      })
      .then((userPosts) => {
        setPosts({ allPosts: userPosts, postsOnScreen: userPosts });
        setShowingAllPosts(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchAllPosts() {
    fetch('http://localhost:3000/posts')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch all posts");
        }
        return response.json();
      })
      .then((allPosts) => {
        setPosts({ allPosts: posts.allPosts, postsOnScreen: allPosts });
        setShowingAllPosts(true);
      })
      .catch((error) => {
        console.log('Error fetching all posts:', error);
      });
  }

  function togglePostsView() {
    if (showingAllPosts) {
      fetchUserPosts();
    } else {
      fetchAllPosts();
    }
  }

  function handleSearchInputChange(event) {
    setSearchInput(event.target.value);
  }

  function searchPosts() {
    if (searchInput.trim() === '') {
      if (showingAllPosts) {
        fetchAllPosts();
      } else {
        fetchUserPosts();
      }
    } else {
      const searchTerm = searchInput.toLowerCase().trim();
      const filteredPosts = posts.postsOnScreen.filter(
        (post) =>
          post.id.toString().includes(searchTerm) || post.title.toLowerCase().includes(searchTerm)
      );
      setPosts((prev) => ({ ...prev, postsOnScreen: filteredPosts }));
    }
  }

  function showAddPost() {
    setAdd(true);
  }

  function handleAdd(title, body) {
    const newPostData = {
      title: title,
      body: body,
      userId: currentUser.id,
    };
    fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPostData),
    })
      .then((data) => {
        if (!data.ok) {
          throw new Error("Can't create the post");
        }
        return data.json();
      })
      .then((response) => {
        let newArray = posts.allPosts;
        newArray.push(response);
        setPosts({ allPosts: newArray, postsOnScreen: newArray });
        setAdd(false);
      })
      .catch(error => {
        console.error('Error creating post:', error);
      });
  }

  return (
    <>
      <div>
        <div className={styles.actions}>
          <button className={styles.button} onClick={showAddPost}>➕</button>
          <button className={styles.viewButton} onClick={togglePostsView}>
            {showingAllPosts ? 'View My Posts' : 'View All Posts'}
          </button>
          <div>
            <input
              type="text"
              placeholder="Search by ID or Title 🎙️ 🔎"
              value={searchInput}
              onChange={handleSearchInputChange}
              className={styles.input}
            />
            <button className={styles.searchButton} onClick={searchPosts}>
              🔎
            </button>
          </div>
        </div>
        {add && <PostForm
          setForm={setAdd}
          formType={'Add'}
          handleSubmit={handleAdd}
          title={null}
          body={null} />}
        <div className={popPost ? styles.pop : styles.notPop}>
          <div className={styles.postsContainer}>
            {posts.postsOnScreen.length === 0 && <p>No posts to display. 😜</p>}
            {posts.postsOnScreen.map((p) => (
              <Post
                posts={posts}
                setPosts={setPosts}
                key={p.id}
                currentPost={p}
                className={styles.post}
                setPopPost={setPopPost}
                currentUser={currentUser}
                searchPosts={searchPosts}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Posts;
