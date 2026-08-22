import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Login.css";

/* --- inline icons (no extra dependency) --- */
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
    <path d="m3.5 7 7.4 5.3a2 2 0 0 0 2.2 0L20.5 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="10.5" width="16" height="10.5" rx="3" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.2 12S6 5.5 12 5.5 21.8 12 21.8 12 18 18.5 12 18.5 2.2 12 2.2 12Z" />
    <circle cx="12" cy="12" r="3.2" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.7 6.7A8.7 8.7 0 0 1 12 6.5c6 0 9.8 6.5 9.8 6.5a18 18 0 0 1-2.9 3.6" />
    <path d="M6.4 8.1A17.7 17.7 0 0 0 2.2 13S6 19.5 12 19.5a8.9 8.9 0 0 0 3.6-.7" />
    <path d="m9.8 10.4a3.2 3.2 0 0 0 4.4 4.5" />
    <path d="m3.5 3.5 17 17" />
  </svg>
);

const AlertIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9.2" />
    <path d="M12 7.8v5.4M12 16.3h.01" />
  </svg>
);

const CheckIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m4.5 12.5 5 5 10-10" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 12h14M13 6.5l5.5 5.5L13 17.5" />
  </svg>
);

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: localStorage.getItem("rememberedEmail") || "",
    password: "",
  });
  const [remember, setRemember] = useState(
    Boolean(localStorage.getItem("rememberedEmail"))
  );
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleKey = (e) => {
    if (typeof e.getModifierState === "function") {
      setCapsOn(e.getModifierState("CapsLock"));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (
      storedUser &&
      storedUser.email === loginData.email &&
      storedUser.password === loginData.password
    ) {
      localStorage.setItem("currentUser", JSON.stringify(storedUser));

      if (remember) {
        localStorage.setItem("rememberedEmail", storedUser.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      const existingContacts = JSON.parse(localStorage.getItem("friendContactList")) || {};
      if (!existingContacts[storedUser.email]) {
        existingContacts[storedUser.email] = [];
        localStorage.setItem("friendContactList", JSON.stringify(existingContacts));
      }

      setDone(true);
      timerRef.current = setTimeout(() => navigate("/contacts"), 750);
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.form
        className="login-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={
          error
            ? { opacity: 1, y: 0, scale: 1, x: [0, -9, 9, -7, 7, 0] }
            : { opacity: 1, y: 0, scale: 1, x: 0 }
        }
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="login-brand"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.12, type: "spring", stiffness: 220, damping: 16 }}
        >
          <img className="login-icon" src="/login.jpg" alt="" />
        </motion.div>

        <h2>Welcome back</h2>
        <p className="login-subtitle">Sign in to open your contact list</p>

        <div className="login-field">
          <input
            id="login-email"
            type="email"
            name="email"
            placeholder=" "
            autoComplete="email"
            value={loginData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="login-email">Email address</label>
          <span className="field-icon">
            <MailIcon />
          </span>
        </div>

        <div className={`login-field has-toggle${error ? " invalid" : ""}`}>
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder=" "
            autoComplete="current-password"
            value={loginData.password}
            onChange={handleChange}
            onKeyUp={handleKey}
            onKeyDown={handleKey}
            onBlur={() => setCapsOn(false)}
            required
          />
          <label htmlFor="login-password">Password</label>
          <span className="field-icon">
            <LockIcon />
          </span>
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        <div className="login-meta">
          <label className="login-remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="box">
              <CheckIcon size={12} />
            </span>
            Remember me
          </label>

          <AnimatePresence>
            {capsOn && (
              <motion.span
                className="caps-hint"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AlertIcon /> Caps Lock is on
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error && (
            <motion.span
              className="error"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 14 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.22 }}
            >
              <AlertIcon />
              {error}
            </motion.span>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          className={done ? "is-done" : ""}
          disabled={done}
          whileHover={done ? {} : { y: -2 }}
          whileTap={done ? {} : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          <span className="btn-label">
            {done ? (
              <>
                <CheckIcon /> Signed in
              </>
            ) : (
              <>
                Sign in <ArrowIcon />
              </>
            )}
          </span>
        </motion.button>

        <div className="login-divider">New here?</div>

        <p className="signup-link">
          <a href="/signup" onClick={(e) => { e.preventDefault(); navigate("/signup"); }}>
            Create an account
          </a>
        </p>
      </motion.form>
    </motion.div>
  );
};

export default Login;
