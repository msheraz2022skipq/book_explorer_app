import React, { useState, useEffect, useCallback } from "react";
import BookList from "./components/BookList";
import BookDetailsModal from "./components/BookDetailsModal";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchBooks = useCallback(
    async (isNewSearch = false) => {
      if (!query.trim()) return;

      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            query
          )}&startIndex=${startIndex}&maxResults=20`
        );
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        const newBooks = data.items || [];

        setBooks((prev) => (isNewSearch ? newBooks : [...prev, ...newBooks]));
        setHasMore(newBooks.length > 0);
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [query, startIndex]
  );

  // Initial or new search
  const handleSearch = (e) => {
    e.preventDefault();
    setStartIndex(0);
    setBooks([]);
    fetchBooks(true);
  };

  // Load more on scroll
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (nearBottom && !loading && hasMore) {
        setStartIndex((prev) => prev + 20);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // Fetch more when startIndex changes
  useEffect(() => {
    if (startIndex !== 0) {
      fetchBooks();
    }
  }, [startIndex]);

  return (
    <div className="container">
      <h1>Book Explorer</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {books.length > 0 && <p>Found {books.length} books</p>}

      <BookList
        books={books}
        onBookClick={(book) => {
          setSelectedBook(book);
          document.body.classList.add("modal-open");
        }}
      />

      {selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          onClose={() => {
            setSelectedBook(null);
            document.body.classList.remove("modal-open");
          }}
        />
      )}
    </div>
  );
}
