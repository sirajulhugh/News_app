// News.jsx - Updated with fixes for profile image overflow, button order, and edit modal

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Weather from './Weather';
import Calendar from './Calendar';
import './News.css';
import userImg from '../assets/images/user.jpg';
import noImg from '../assets/images/no-img.png';
import axios from 'axios';
import NewsModal from './NewsModal';
import Bookmark from './Bookmark';
import BlogModal from './BlogModal';
import EditBlogModal from './EditBlogModal';
import toast, { Toaster } from 'react-hot-toast';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

const categories = [
  'general', 'world', 'business', 'technology', 'entertainment',
  'sports', 'science', 'health', 'nation', 'bookmarks'
];

const News = ({ blogPosts, onShowBlogs, onEditPost }) => {
  const [headline, setHeadline] = useState(null);
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [postBeingEdited, setPostBeingEdited] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
    return () => unsubscribe();
  }, []);

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;
    const storage = getStorage();
    const storageRef = ref(storage, `profilePics/${currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await updateProfile(currentUser, { photoURL: url });
    setCurrentUser({ ...currentUser, photoURL: url });
    toast.success("Profile picture updated!");
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setBookmarks(saved);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError('');
      try {
        const apiKey = '747bd5a7d76ad9e6a205091ef9ca00e3';
        let url = `https://gnews.io/api/v4/top-headlines?category=${selectedCategory}&lang=en&apikey=${apiKey}`;
        if (searchQuery) {
          url = `https://gnews.io/api/v4/search?q=${searchQuery}&lang=en&apikey=${apiKey}`;
        }
        const response = await axios.get(url);
        const articles = response.data.articles.map(article => ({
          ...article,
          image: article.image || noImg
        }));
        setHeadline(articles[0] || null);
        setNews(articles.slice(1, 7));
      } catch (err) {
        setError('Failed to fetch news. Please try again later.');
        setHeadline(null);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    if (selectedCategory !== 'bookmarks') fetchNews();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory, searchQuery]);

  const handleDeletePostModal = async (post) => {
    if (!post?.id) return;
    try {
      await deleteDoc(doc(db, 'blogs', post.id));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleBookmarkClick = (article) => {
    const isBookmarked = bookmarks.some(b => b.title === article.title);
    const updated = isBookmarked
      ? bookmarks.filter(b => b.title !== article.title)
      : [...bookmarks, article];
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const isBookmarked = (article) => bookmarks.some(b => b.title === article.title);

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    setSearchQuery('');
    setSelectedCategory(category);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchQuery(searchInput);
    setSelectedCategory('general');
  };

  return (
    <div className="news">
      <Toaster position="top-right" />
      <header className="news-header">
        <h1 className="logo">News & Blogs</h1>
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search news and blogs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
        </form>
      </header>

      <div className="news-content">
        <aside className="navbar">
          <div className="user" tabIndex={0}>
            <label htmlFor="profile-upload" style={{ cursor: 'pointer' }}>
              <img src={currentUser?.photoURL || userImg} alt="User" className="profile-img" />
            </label>
            <input type="file" id="profile-upload" style={{ display: 'none' }} onChange={handleProfileUpload} />
            <p>{currentUser?.displayName || currentUser?.email?.split('@')[0]}</p>
            <p className="user-email">{currentUser?.email}</p>

            <button className="write-blog-button" onClick={onShowBlogs}>
              ✍️ Write My Blog
            </button>
          </div>

          <nav className="categories">
            <h1 className="nav-heading">Categories</h1>
            <div className="nav-links">
              {categories.map((category) =>
                category === 'bookmarks' ? (
                  <button key={category} className="nav-link" onClick={() => setShowBookmarksModal(true)}>
                    Bookmarks <i className="fa-regular fa-bookmark"></i>
                  </button>
                ) : (
                  <button
                    key={category}
                    className={`nav-link ${selectedCategory === category ? 'active' : ''}`}
                    onClick={(e) => handleCategoryClick(e, category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                )
              )}

              <button className="signout-button nav-link" onClick={() => signOut(auth)}>
                🔓 Sign Out
              </button>
            </div>
          </nav>
        </aside>

        <main className="news-section">
          {loading ? (
            <div className="news-grid">
              {Array(6).fill(0).map((_, i) => <div className="news-skeleton" key={i}></div>)}
            </div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              <p className="current-filter">
                {searchQuery ? `Showing results for "${searchQuery}"` : `Category: ${selectedCategory}`}
              </p>

              {headline && (
                <div className="headline" onClick={() => { setSelectedArticle(headline); setShowModal(true); }}>
                  <img src={headline.image} alt="Headline" />
                  <h2 className="headline-title">
                    {headline.title}
                    <i className={`fa-bookmark bookmark ${isBookmarked(headline) ? 'fa-solid' : 'fa-regular'}`}
                      onClick={(e) => { e.stopPropagation(); handleBookmarkClick(headline); }}></i>
                  </h2>
                </div>
              )}

              <div className="news-grid">
                {news.map((article, index) => (
                  <div key={article.url || index} className="news-grid-items" onClick={() => { setSelectedArticle(article); setShowModal(true); }}>
                    <img src={article.image} alt="News" />
                    <h3>
                      <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        {article.title.length > 80 ? article.title.slice(0, 80) + '...' : article.title}
                      </a>
                      <i className={`fa-bookmark bookmark ${isBookmarked(article) ? 'fa-solid' : 'fa-regular'}`}
                        onClick={(e) => { e.stopPropagation(); handleBookmarkClick(article); }}></i>
                    </h3>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        <section className="my-blogs-boxed">
          <h1 className="myblogs">All Blogs</h1>
          <div className="blogs-grid fade-in">
            {blogPosts.length > 0 ? blogPosts.map((post) => (
              <div className="blog-card" key={post.id}>
                <img src={post.image || noImg} alt={post.title} />
                <div className="card-content">
                  <h3>{post.title}</h3>
                  <div dangerouslySetInnerHTML={{ __html: post.content?.slice(0, 120) + '...' }}></div>
                  <div className="post-buttons">
                    <button className="action-btn view" onClick={() => { setSelectedBlogPost(post); setShowBlogModal(true); }}>
                      <i className="fa fa-eye"></i> View
                    </button>
                    <button className="action-btn edit" onClick={() => { setPostBeingEdited(post); setShowEditModal(true); }}>
                      <i className="fa fa-pen"></i> Edit
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeletePostModal(post)}>
                      <i className="fa fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            )) : <p className="no-posts">No blog posts yet.</p>}
          </div>
        </section>

        <NewsModal show={showModal} article={selectedArticle} onClose={() => setShowModal(false)} />
        <BlogModal show={showBlogModal} blog={selectedBlogPost} onClose={() => setShowBlogModal(false)} />
        <EditBlogModal show={showEditModal} post={postBeingEdited} onClose={() => setShowEditModal(false)} />
        {showBookmarksModal && (
          <Bookmark
            show={showBookmarksModal}
            bookmarks={bookmarks}
            onClose={() => setShowBookmarksModal(false)}
            onSelectArticle={(a) => { setSelectedArticle(a); setShowModal(true); }}
            onDeleteBookmark={handleBookmarkClick}
          />
        )}

        <div className="weather-calendar">
          <Weather />
          <Calendar />
        </div>
      </div>

      <footer className="news-footer">
        <p><span>News & Blogs</span></p>
        <p>&copy; All rights reserved. By egbusonEmmanuel</p>
      </footer>
    </div>
  );
};

export default News;