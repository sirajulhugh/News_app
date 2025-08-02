import React from 'react';
import './NewsModal.css';
import noImg from '../assets/images/no-img.png';
import './Modal.css';
const NewsModal = ({ show, article, onClose }) => {
  if (!show || !article) return null;

  const {
    title, 
    source,
    publishedAt,
    content,
    image,
    url
  } = article;

 
  const formattedDate = new Date(publishedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </span>

        <img src={image || noImg} alt="Article" className="modal-image" />
        <h2 className="modal-title">{title}</h2>
        <p className="modal-source">Source: {source?.name || "Unknown"}</p>
        <p className="modal-date">{formattedDate}</p>
        <p className="modal-content-text">{content || "No content available."}</p>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more-link"
          >
            Read full article
          </a>
        )}
      </div>
    </div>
  );
};

export default NewsModal;
