// ✅ UserBlog.jsx - Fully Integrated with BlogModal
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import noImg from "../assets/images/no-img.png";
import BlogModal from "./BlogModal";
import "./UserBlog.css";

const UserBlog = ({ currentUser, onBack }) => {
  const [myPosts, setMyPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  const postsPerPage = 6;

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "blogs"),
      where("email", "==", currentUser.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyPosts(posts);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "blogs", id));
        alert("✅ Post deleted!");
      } catch (err) {
        console.error("❌ Error deleting post:", err);
      }
    }
  };

  const handleEdit = (post) => {
    navigate(`/blogs/edit/${post.id}`);
  };

  const handleView = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const sortedPosts = [...myPosts].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return sortOrder === "newest"
      ? b.createdAt.toDate() - a.createdAt.toDate()
      : a.createdAt.toDate() - b.createdAt.toDate();
  });

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const paginatedPosts = sortedPosts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  return (
    <div className="user-blog premium-ui">
      <div className="header-bar">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h1 className="title">📚 My Premium Blogs</h1>
        <div className="sort-controls">
          <label>
            Sort:
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </label>
        </div>
      </div>

      {myPosts.length === 0 ? (
        <p className="no-posts">You haven’t written any blog posts yet.</p>
      ) : (
        <>
          <div className="user-blog-grid">
            {paginatedPosts.map((post) => (
              <div className="user-blog-card deluxe" key={post.id}>
                <img
                  src={post.image || noImg}
                  alt={post.title || "Blog image"}
                  onError={(e) => (e.target.src = noImg)}
                />
                <div className="card-content">
                  <h3>{post.title || "Untitled Post"}</h3>
                  <p>
                    {post.content?.length > 100
                      ? post.content.slice(0, 100) + "..."
                      : post.content || "No content available."}
                  </p>
                  <div className="card-actions">
                    <button onClick={() => handleView(post)}>👁 View</button>
                    <button onClick={() => handleEdit(post)}>✏️ Edit</button>
                    <button onClick={() => handleDelete(post.id)}>🗑 Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
              ◀ Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next ▶
            </button>
          </div>
        </>
      )}

      <BlogModal
        show={showModal}
        blog={selectedPost}
        onClose={() => setShowModal(false)}
        onEdit={() => navigate(`/blogs/edit/${selectedPost?.id}`)}
      />
    </div>
  );
};

export default UserBlog;
