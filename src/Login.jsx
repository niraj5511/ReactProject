import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Login.css";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (
      storedUser &&
      storedUser.email === loginData.email &&
      storedUser.password === loginData.password
    ) {
      alert("Login successful!");
      localStorage.setItem("currentUser", JSON.stringify(storedUser));
      const existingContacts = JSON.parse(localStorage.getItem("friendContactList")) || {};
      if (!existingContacts[storedUser.email]) {
        existingContacts[storedUser.email] = [];
        localStorage.setItem("friendContactList", JSON.stringify(existingContacts));
      }
      navigate("/contacts");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form
        className="login-form"
        onSubmit={handleSubmit}
        animate={error ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleChange}
        />

        <AnimatePresence>
          {error && (
            <motion.span 
              className="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>

        <motion.button 
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>

        <p className="signup-link">
          Don't have an account?{" "}
          <a href="/signup" onClick={(e) => { e.preventDefault(); navigate("/signup"); }}>
            Signup here
          </a>
        </p>
      </motion.form>
    </motion.div>
  );
};

export default Login;
