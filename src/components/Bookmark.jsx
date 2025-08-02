import React from 'react';
import './Modal.css';
import './Bookmark.css';

const Bookmark = ({ show, bookmarks, onClose, onSelectArticle, onDeleteBookmark }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </span>
        <h2 className="bookmarks-heading">Bookmarked News</h2>

        {bookmarks.length === 0 ? (
          <p>No bookmarks yet.</p>
        ) : (
          <div className="bookmark-list">
            {bookmarks.map((bookmark, index) => (
              <div
                key={index}
                className="bookmark-item"
                onClick={() => onSelectArticle(bookmark)}
              >
                <img src={bookmark.image} alt="Bookmark" />
                <h3>{bookmark.title}</h3>
                <span
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBookmark(bookmark);
                  }}
                >
                  <i className="fa-regular fa-circle-xmark"></i>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmark;

