import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import './ViewBlogs.css';

const ViewBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="view-blogs-container">
      <h2 className="view-blogs-title">📝 All Blog Posts</h2>
      {blogs.length === 0 ? (
        <p className="no-blogs">No blogs found.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            {blog.image && (
              <img src={blog.image} alt={blog.title} className="blog-image" />
            )}
            <div className="blog-content">
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>
              <span className="blog-date">
                {blog.createdAt?.toDate?.().toLocaleDateString() || 'No date'}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewBlogs;
