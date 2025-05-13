import React from "react";

export default function BookList({ books, onBookClick }) {
  return (
    <div className="book-grid">
      {books.map((book) => {
        const info = book.volumeInfo;
        return (
          <div
            key={book.id}
            className="book-card"
            onClick={() => onBookClick(book)}
          >
            {info.imageLinks?.thumbnail ? (
              <img src={info.imageLinks.thumbnail} alt={info.title} />
            ) : (
              <div className="no-cover">No Cover</div>
            )}
            <h3>{info.title}</h3>
            <p>
              <strong>Author:</strong> {info.authors?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Published:</strong> {info.publishedDate || "N/A"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
