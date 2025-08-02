import React from 'react';
import blogsVideo from '../assets/images/bg.mp4'; 
import '../components/BlogsPremium.css';

const BlogsLayout = ({ children }) => {
  return (
    <div className="blog-container-wrapper">

      <video className="bg-video" autoPlay muted loop playsInline>
        <source src={blogsVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>


      <div className="bg-overlay"></div>

      {children}
    </div>
  );
};

export default BlogsLayout;
