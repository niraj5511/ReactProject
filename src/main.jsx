import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import App from "./App";
import LoginForm from "./Login";
import SignUpForm from "./SignupForm";
import FriendContactList from "./BookSearch";
import "./index.css"; // Optional: Import global styles

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Define routes for navigation */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/contacts" element={<FriendContactList />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
