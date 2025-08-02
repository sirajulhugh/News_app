import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import {
  generateContent,
  generateTags,
  summarizeContent,
  optimizeSEO,
} from '../cohere';
import BlogsLayout from './BlogsLayout';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import './BlogsPremium.css';

const Blogs = ({ onBack }) => {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email || '');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const generateBlogFromPrompt = async () => {
      if (!useAI || prompt.trim().length < 10) return;

      setLoading(true);
      try {
        const aiContent = await generateContent(prompt);
        setContent(aiContent || '');
      } catch (err) {
        console.error('AI generation failed:', err);
        setContent('⚠️ AI generation failed. Try a different prompt.');
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      generateBlogFromPrompt();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [prompt, useAI]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = () => setImageURL(reader.result);
    reader.readAsDataURL(file);
  };

  const convertToHTML = (text) => {
    return text
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => `<p>${line.trim()}</p>`)
      .join('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalContent = content || '';
      let tags = [];
      let summary = '';
      let seoMeta = '';

      if (useAI) {
        tags = await generateTags(finalContent);
        summary = await summarizeContent(finalContent);
        seoMeta = await optimizeSEO(finalContent);
      }

      let imageDataURL = '';
      if (image && image.size <= 900000) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          imageDataURL = reader.result;
          await saveToFirestore(imageDataURL);
        };
        reader.readAsDataURL(image);
      } else {
        if (image && image.size > 900000) {
          toast.error('Image too large (max 900KB)');
          setLoading(false);
          return;
        }
        await saveToFirestore('');
      }

      async function saveToFirestore(img) {
        await addDoc(collection(db, 'blogs'), {
          title: title || prompt,
          content: finalContent,
          image: img,
          tags,
          summary,
          seoMeta,
          email: userEmail,
          createdAt: Timestamp.now(),
        });
        toast.success('✅ Blog saved!');
        resetForm();
      }
    } catch (err) {
      console.error('Error submitting blog:', err);
      toast.error('❌ Failed to submit blog');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setPrompt('');
    setContent('');
    setImage(null);
    setImageURL('');
  };

  return (
    <BlogsLayout>
      <motion.div
        className="blog-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="blog-left-panel"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="panel-title">📢 Share Your Story</h1>
          <p className="panel-description">
            Write your own post or let AI help you. Add an image if you like!
          </p>
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
        </motion.div>

        <motion.div
          className="blog-right-panel"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="blog-heading">
            {useAI ? '⚙️ Generate Blog with AI' : '✍️ Write a New Blog'}
          </h2>

          <div className="toggle-switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
            <span>{useAI ? 'AI Mode' : 'Manual Mode'}</span>
          </div>

          <form onSubmit={handleSubmit} className="blog-form">
            <input
              type="text"
              placeholder={useAI ? 'Blog Title (optional)' : 'Enter Blog Title'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required={!useAI}
            />

            {useAI ? (
              <textarea
                placeholder="What should the blog be about?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            ) : (
              <textarea
                placeholder="Write your blog content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            )}

            {useAI && !loading && content.trim() && (
              <div className="ai-output fade-in">
                <label className="ai-label">🧠 AI Preview:</label>
                <div
                  className="ai-preview"
                  dangerouslySetInnerHTML={{ __html: convertToHTML(content) }}
                />
              </div>
            )}

            {useAI && loading && (
              <p className="ai-status">
                <i className="fa-solid fa-spinner fa-spin"></i> AI is writing...
              </p>
            )}

            <div className="custom-file-upload">
              <label htmlFor="imageUpload">📸 Upload an Image</label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <button type="submit" className="primary" disabled={loading}>
              {loading ? '⏳ Submitting...' : '🚀 Submit Blog'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </BlogsLayout>
  );
};

export default Blogs;

