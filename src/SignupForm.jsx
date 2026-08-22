import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./SignupForm.css";

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

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 5 5.8v5.4c0 4.3 2.9 8.1 7 9.3 4.1-1.2 7-5 7-9.3V5.8L12 3Z" />
    <path d="m9.2 12.2 2 2 3.6-3.8" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8.2" r="3.7" />
    <path d="M4.8 20.2a7.2 7.2 0 0 1 14.4 0" />
  </svg>
);

const CaretIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
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

const AlertIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];

const scorePassword = (pw) => {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score += 1;
  if (pw.length >= 10) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score += 1;
  return Math.min(score, 4);
};

/* small helper so every field renders identically */
const FieldError = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.span
        className="error"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18 }}
      >
        <AlertIcon />
        {message}
      </motion.span>
    )}
  </AnimatePresence>
);

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    // age: "",
    gender: "",
    // address: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    // Validate gender
    if (!formData.gender) {
      newErrors.gender = "Please select your gender.";
      isValid = false;
    }

    // // Validate address
    // if (!formData.address) {
    //   newErrors.address = "Address is required.";
    //   isValid = false;
    // }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Save user data in localStorage
      localStorage.setItem("user", JSON.stringify({ email: formData.email, password: formData.password }));
      setDone(true);
      timerRef.current = setTimeout(() => navigate("/"), 850); // Redirect to the login page
    }
  };

  const strength = scorePassword(formData.password);
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <motion.div
      className="signup-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.form
        className="signup-form"
        onSubmit={handleSubmit}
        noValidate
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={
          hasErrors
            ? { opacity: 1, y: 0, scale: 1, x: [0, -8, 8, -6, 6, 0] }
            : { opacity: 1, y: 0, scale: 1, x: 0 }
        }
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="signup-brand"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.12, type: "spring", stiffness: 220, damping: 16 }}
        >
          <img className="signup-icon" src="/signup.png" alt="" />
        </motion.div>

        <h2>Create your account</h2>
        <p className="signup-subtitle">Takes less than a minute to get started</p>

        <div className={`signup-field${errors.email ? " invalid" : ""}`}>
          <input
            id="signup-email"
            type="email"
            name="email"
            placeholder=" "
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="signup-email">Email address</label>
          <span className="field-icon">
            <MailIcon />
          </span>
          <FieldError message={errors.email} />
        </div>

        <div className={`signup-field has-toggle${errors.password ? " invalid" : ""}`}>
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder=" "
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <label htmlFor="signup-password">Password</label>
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

          <AnimatePresence>
            {formData.password && (
              <motion.div
                className="pw-strength"
                data-level={strength}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="pw-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <span>{STRENGTH_LABELS[strength]}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <FieldError message={errors.password} />
        </div>

        <div className={`signup-field has-toggle${errors.confirmPassword ? " invalid" : ""}`}>
          <input
            id="signup-confirm"
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder=" "
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <label htmlFor="signup-confirm">Confirm password</label>
          <span className="field-icon">
            <ShieldIcon />
          </span>
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            title={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
          </button>
          <FieldError message={errors.confirmPassword} />
        </div>

        {/* <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
        />
        {errors.age && <span className="error">{errors.age}</span>} */}

        <div
          className={`signup-field${formData.gender ? " filled" : ""}${errors.gender ? " invalid" : ""}`}
        >
          <select id="signup-gender" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="" disabled>
              {" "}
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <label htmlFor="signup-gender">Gender</label>
          <span className="field-icon">
            <UserIcon />
          </span>
          <span className="select-caret">
            <CaretIcon />
          </span>
          <FieldError message={errors.gender} />
        </div>

        {/* <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        ></textarea>
        {errors.address && <span className="error">{errors.address}</span>} */}

        <motion.button
          type="submit"
          disabled={done}
          whileHover={done ? {} : { y: -2 }}
          whileTap={done ? {} : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          <span className="btn-label">
            {done ? (
              <>
                <CheckIcon /> Account created
              </>
            ) : (
              <>
                Create account <ArrowIcon />
              </>
            )}
          </span>
        </motion.button>

        <div className="signup-divider">Already registered?</div>

        <p className="login-back">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
            Sign in instead
          </a>
        </p>
      </motion.form>
    </motion.div>
  );
};

export default SignupForm;
