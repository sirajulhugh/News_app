import React from 'react';

const BlogPostModal = ({ show, post, onClose, onEdit, onDelete }) => {
  if (!show || !post) return null;
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">&times;</button>
        <h2 id="modal-title">{post.title}</h2>
        {post.image && <img src={post.image} alt={`Blog post: ${post.title}`} style={{ maxWidth: '100%', marginBottom: '1rem' }} />}
        <p>{post.content}</p>

        <div className="modal-actions">
          <button onClick={() => onEdit(post)} className="edit-button" aria-label="Edit blog post">Edit</button>
          <button onClick={() => onDelete(post)} className="delete-button" aria-label="Delete blog post">Delete</button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: #1a1a1a;
          padding: 2rem;
          border-radius: 8px;
          max-width: 600px;
          width: 90%;
          color: white;
          position: relative;
        }
        .modal-close {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: transparent;
          border: none;
          font-size: 2rem;
          color: white;
          cursor: pointer;
        }
        .modal-actions {
          margin-top: 1.5rem;
          display: flex;
          gap: 1rem;
        }
        .edit-button, .delete-button {
          padding: 0.5rem 1rem;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          font-weight: 600;
        }
        .edit-button {
          background-color: #007bff;
          color: white;
        }
        .delete-button {
          background-color: #dc3545;
          color: white;
        }
        .edit-button:hover {
          background-color: #0056b3;
        }
        .delete-button:hover {
          background-color: #b02a37;
        }
      `}</style>
    </div>
  );
};

export default BlogPostModal;
