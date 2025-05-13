import React from "react";

export default function BookDetailsModal({ book, onClose }) {
  if (!book) return null;

  const info = book.volumeInfo;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {info.imageLinks?.thumbnail && (
          <img src={info.imageLinks.thumbnail} alt={info.title} />
        )}
        <h2>{info.title}</h2>
        <p>
          <strong>Author:</strong> {info.authors?.join(", ") || "N/A"}
        </p>
        <p>
          <strong>Published:</strong> {info.publishedDate || "N/A"}
        </p>
        <p>
          <strong>Description:</strong>
        </p>
        <p>{info.description || "No description available."}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
