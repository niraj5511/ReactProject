import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookSearch.css"; // Ensure this file exists in the styles folder

// via.placeholder.com no longer resolves, so keep the fallback local
const BOOK_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="150">' +
      '<rect width="100" height="150" rx="5" fill="#e9ecef"/>' +
      '<text x="50" y="79" font-family="sans-serif" font-size="11" fill="#8a94a0" text-anchor="middle">No cover</text>' +
      "</svg>"
  );

const BookSearch = () => {
  const [query, setQuery] = useState(""); // Stores user input
  const [books, setBooks] = useState([]); // Stores search results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchHistory, setSearchHistory] = useState([]); // Stores search history
  const navigate = useNavigate();

  // Load search history from localStorage when the component mounts
  useEffect(() => {
    // Don't let this page be reached by typing the URL without logging in
    if (!localStorage.getItem("currentUser")) {
      navigate("/", { replace: true });
      return;
    }
    const storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedHistory);
  }, [navigate]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a book title or author.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&maxResults=10`
      );
      setBooks(response.data.items || []);

      // Update search history
      const updatedHistory = [query, ...searchHistory.filter((item) => item !== query)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory)); // Save to localStorage
    } catch (err) {
      setBooks([]);
      const status = err.response?.status;
      setError(
        status === 429
          ? "Google Books is rate limiting requests right now. Try again later."
          : `Failed to fetch books.${status ? ` (error ${status})` : ""} Try again later.`
      );
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser"); // Remove logged-in user data
    navigate("/"); // Redirect to login page
  };

  const handleBookClick = (book) => {
    // No /book/:id route exists, so send them to the Google Books info page
    const infoLink = book.volumeInfo.infoLink;
    if (infoLink) {
      window.open(infoLink, "_blank", "noopener");
    } else {
      setError("Details are not available for this book.");
    }
  };

  const handleReadBook = (book) => {
    const previewLink = book.volumeInfo.previewLink;
    if (previewLink) {
      // Redirect to the Google Books preview link
      window.open(previewLink, "_blank");
    } else {
      alert("Preview link is not available for this book.");
    }
  };

  return (
    <div className="book-search-container">
      <h2>Search for Books</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter book title or author..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Search History */}
      <div className="search-history">
        <h3>Recent Searches</h3>
        <ul>
          {searchHistory.length > 0 ? (
            searchHistory.map((item, index) => (
              <li key={index} onClick={() => setQuery(item)}>
                {item}
              </li>
            ))
          ) : (
            <p>No recent searches</p>
          )}
        </ul>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <div className="loading-spinner">Loading...</div>}

      <div className="book-list">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="book-card">
              <img
                src={
                  book.volumeInfo.imageLinks?.thumbnail?.replace(
                    "http://",
                    "https://"
                  ) || BOOK_PLACEHOLDER
                }
                alt={book.volumeInfo.title}
              />
              <h3>{book.volumeInfo.title}</h3>
              <p>{book.volumeInfo.authors?.join(", ")}</p>
              <button onClick={() => handleBookClick(book)} className="details-btn">
                View Details
              </button>
              <button onClick={() => handleReadBook(book)} className="read-btn">
                Read
              </button>
            </div>
          ))
        ) : (
          !loading && <p>No books found. Try a different search.</p>
        )}
      </div>

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default BookSearch;
