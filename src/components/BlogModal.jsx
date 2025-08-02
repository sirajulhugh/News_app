import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import noImg from "../assets/images/no-img.png";
import "./Modal.css";

const BlogModal = ({ show, blog, onClose, onUpdate, onCancel }) => {
  if (!show || !blog) return null;

  const { title, content, image, createdAt } = blog;

  useEffect(() => {
    if (show) {
      document.body.classList.add("modal-open");
      const modal = document.querySelector(".modal-content");
      if (modal) modal.scrollTop = 0;
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [show]);

  const formattedDate = createdAt?.toDate?.().toLocaleString();

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <h2>{title}</h2>
        <p style={{ fontSize: "0.9rem", color: "#999", marginBottom: "1rem" }}>
          {formattedDate}
        </p>

        <img
          src={image || noImg}
          alt="Blog Visual"
          className="modal-image"
        />

        <div className="markdown-body">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                return !inline ? (
                  <SyntaxHighlighter style={oneDark} language="javascript" PreTag="div" {...props}>
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code {...props}>{children}</code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

     
      </div>
    </div>
  );
};

export default BlogModal;
