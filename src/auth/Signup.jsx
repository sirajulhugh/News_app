import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // ✅ Add this
import { auth } from '../firebase';
import './GlassLogin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const Signup = ({ showGoogleButton }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      return setError('Please enter a valid email address.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(user);
      alert('Verification email sent! Please check your inbox.');
      navigate('/login'); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/news'); 
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
          <h1 className="bold-brand">News & Blog</h1>
          <p className="tagline">Your Voice. Your Stories.</p>
        </div>

        <div className="login-right">
          <form className="login-box" onSubmit={handleSignup}>
            <h2>Sign Up</h2>

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

            <button type="submit" className="login-btn">Sign Up</button>

            {showGoogleButton && (
              <button type="button" className="google-btn standard-google" onClick={handleGoogleLogin}>
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" className="google-logo" />
                Sign up with Google
              </button>
            )}

            <p className="register-link">
              Already have an account?{' '}
              <span onClick={() => navigate('/login')} className="link-btn">Log in</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
