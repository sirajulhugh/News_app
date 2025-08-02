import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import noImg from "../assets/images/no-img.png";
import "./BlogDetails.css"; 

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost(docSnap.data());
        } else {
          setError("🚫 Blog post not found.");
        }
      } catch (err) {
        console.error(err);
        setError("⚠️ Failed to fetch blog post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="blog-details-loading">⏳ Loading post...</div>;
  if (error) return <div className="blog-details-error">{error}</div>;

  return (
    <div className="blog-details-container">
      <button className="back-button" onClick={() => navigate("/blogs")}>
        ← Back to Blogs
      </button>

      <h1 className="blog-title">{post.title || "Untitled Blog"}</h1>
      <p className="blog-author">By: {post.email || "Unknown Author"}</p>

      <img
        src={post.image || noImg}
        alt={post.title || "Blog Image"}
        className="blog-image"
      />

      <div
        className="blog-html-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

   
      {post.summary && <p className="blog-summary">Summary: {post.summary}</p>}
      {post.tags && (
        <p className="blog-tags">
          Tags:{" "}
          {Array.isArray(post.tags) ? post.tags.join(", ") : post.tags}
        </p>
      )}
    </div>
  );
};

export default BlogDetails;
