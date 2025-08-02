
import React, { useState, useEffect, lazy, Suspense } from 'react';
import './Modal.css';
import noImg from '../assets/images/no-img.png';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';

const ReactQuill = lazy(() => import('react-quill'));
import 'react-quill/dist/quill.snow.css';

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'clean']
];

const EditBlogModal = ({ show, post, onClose }) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setImage(post.image || '');
      setContent(post.content || '');
    }
  }, [post]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content required.');
      return;
    }

    try {
      setLoading(true);
      const ref = doc(db, 'blogs', post.id);
      await updateDoc(ref, { title, image, content });
      toast.success('✅ Blog updated!');
      onClose();
    } catch (err) {
      toast.error('❌ Failed to update.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!show || !post) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content wide" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1rem' }}>Edit Blog</h2>

        <input
          className="modal-input"
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="modal-input"
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <div className="quill-wrapper">
          <Suspense fallback={<p>Loading editor...</p>}>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={{ toolbar: toolbarOptions }}
            />
          </Suspense>
        </div>

        {image && (
          <img
            src={image}
            onError={(e) => (e.target.src = noImg)}
            className="preview-img"
            alt="preview"
          />
        )}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>❌ Cancel</button>
          <button className="update-btn" onClick={handleUpdate} disabled={loading}>
            ✅ {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBlogModal;
