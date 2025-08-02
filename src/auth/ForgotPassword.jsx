// ✅ Updated Login.jsx to use external ForgotPassword screen
import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';
import './GlassLogin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = ({ setAuthView, showGoogleButton }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Login failed: ' + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError('Google login failed: ' + err.message);
    }
  };

  return (
    <div className="login-page" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="login-wrapper">
        <div className="login-left">
          <h1 className="bold-brand">🎓 Bingham News & Blog</h1>
          <p className="tagline">Stay Updated. Stay Informed.</p>
        </div>

        <div className="login-right">
          <form className="login-box" onSubmit={handleLogin}>
            <h2>Login</h2>

            {error && <div className="auth-error">{error}</div>}

            <div className="input-container">
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-container">
              <FontAwesomeIcon icon={faLock} className="icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="login-btn">Login</button>

            <p className="forgot-password" onClick={() => setAuthView('forgot')}>
              Forgot Password?
            </p>

            {showGoogleButton && (
              <button type="button" className="google-btn standard-google" onClick={handleGoogleLogin}>
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" className="google-logo" />
                Sign in with Google
              </button>
            )}

            <p className="register-link">
              Don’t have an account?{' '}
              <span onClick={() => setAuthView("signup")} className="link-btn">Sign up</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;