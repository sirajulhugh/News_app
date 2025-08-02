import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";

const EditBlog = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const ref = doc(db, "blogs", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data.email !== user.email) {
            toast.error("⛔ Not authorized to edit this post");
            navigate("/");
            return;
          }
          setTitle(data.title);
          setContent(data.content);
          setImage(data.image || "");
        } else {
          toast.error("❌ Post not found");
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        toast.error("🚫 Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user.email, navigate]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("⚠️ Title and content required");
      return;
    }
    try {
      await updateDoc(doc(db, "blogs", id), {
        title,
        content,
        image,
        updatedAt: Timestamp.now(),
      });
      toast.success("✅ Blog updated");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("❌ Update failed");
    }
  };

  if (loading) return <p className="edit-loading">Loading post...</p>;

  return (
    <div className="edit-blog-container">
      <h2 className="edit-title">✏️ Edit Blog Post</h2>

      <input
        type="text"
        placeholder="Enter blog title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="edit-input"
      />

      <textarea
        rows={10}
        placeholder="Update your content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="edit-textarea"
      ></textarea>

      <input
        type="text"
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="edit-input"
      />

      {image && (
        <img
          src={image}
          alt="Preview"
          className="edit-image-preview"
        />
      )}

      <div className="edit-actions">
        <button className="edit-btn cancel" onClick={() => navigate(-1)}>
          ⬅ Cancel
        </button>
        <button className="edit-btn update" onClick={handleUpdate}>
          💾 Update Post
        </button>
      </div>
    </div>
  );
};

export default EditBlog;
