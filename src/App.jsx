import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { Toaster, toast } from "react-hot-toast";

import { auth, db } from "./firebase";

// Components
import LandingPage from "./components/LandingPage";
import News from "./components/News";
import Blogs from "./components/Blogs";
import BlogsLayout from "./components/BlogsLayout";
import EditBlog from "./components/EditBlog";
import UserBlog from "./components/UserBlog";

// Auth
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";

// 🔒 Route Guard
const ProtectedRoute = ({ user, children }) =>
  user ? children : <Navigate to="/login" replace />;

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);
  const [postBeingEdited, setPostBeingEdited] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const navigate = useNavigate();
  const location = useLocation();

  // 🔐 Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        setUser(null);
        setLoading(false);
        return;
      }

      const provider = u.providerData?.[0]?.providerId;
      if (provider === "google.com" || u.emailVerified) {
        setUser(u);
      } else {
        toast.error("⚠️ Please verify your email to continue.");
        signOut(auth);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 🌍 Blog Data Listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "blogs"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogPosts(data);
    });

    return unsub;
  }, []);

  // 🎨 Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🧭 Scroll Reset on Navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      toast.success("👋 Logged out");
      navigate("/login");
    });
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="container">
      <Toaster position="top-right" />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login showGoogleButton />} />
        <Route path="/signup" element={<Signup showGoogleButton />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* Private Routes */}
        <Route
          path="/news"
          element={
            <ProtectedRoute user={user}>
              <News
                blogPosts={blogPosts}
                onShowBlogs={() => {
                  setPostBeingEdited(null);
                  navigate("/blogs");
                }}
                onEditPost={(post) => {
                  setPostBeingEdited(post);
                  navigate(`/blogs/edit/${post.id}`);
                }}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs"
          element={
            <ProtectedRoute user={user}>
              <BlogsLayout>
                <Blogs
                  onBack={() => navigate("/news")}
                  onPostSubmit={() => navigate("/news")}
                  onUpdatePost={() => navigate("/news")}
                  editingPost={postBeingEdited}
                />
              </BlogsLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/edit/:id"
          element={
            <ProtectedRoute user={user}>
              <EditBlog user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/u/:userId"
          element={
            <ProtectedRoute user={user}>
              <UserBlog currentUser={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
