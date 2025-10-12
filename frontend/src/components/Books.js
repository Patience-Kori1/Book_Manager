// src/pages/Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaSpinner, FaBook } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css"; // Import du CSS spécifique à Home

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8081/");
        setBooks(res.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des livres :", err);
        setError("Impossible de charger les livres. Vérifiez que le serveur est démarré.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Souhaitez-vous vraiment supprimer ce livre ?")) {
      try {
        await axios.delete(`http://localhost:8081/books/${id}`);
        setBooks(books.filter((book) => book.id !== id));
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
        alert("Erreur lors de la suppression du livre.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center loading-container">
        <div className="spinner"></div>
        <span className="ms-3">Chargement des livres...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center error-container">
        <div className="alert alert-danger text-center p-4">
          <FaBook className="mb-3" size={50} />
          <h4>Erreur de chargement</h4>
          <p>{error}</p>
          <button className="btn btn-accent" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center py-5 home-container">
      {/* En-tête */}
      <div className="text-center mb-5">
        <h1 className="fw-bold display-4 mb-3 position-relative title">
          <FaBook className="me-3" />
          Ma Bibliothèque
          <span className="title-underline"></span>
        </h1>
        <p className="lead subtitle">
          Découvrez et gérez votre collection de livres
        </p>
        <Link to="/create" className="btn btn-accent btn-lg add-book-btn">
          ➕ Ajouter un livre
        </Link>
      </div>

      {/* Compteur de livres */}
      {books.length > 0 && (
        <div className="mb-4">
          <span className="badge bg-accent fs-6 p-2 book-counter">
            {books.length} livre{books.length > 1 ? 's' : ''} dans la bibliothèque
          </span>
        </div>
      )}

      {/* Grille des livres */}
      <div className="container" style={{ maxWidth: "1400px" }}>
        <div className="row g-4 justify-content-center">
          {books.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div className="alert alert-dark">
                <FaBook className="mb-3" size={50} />
                <h4>Aucun livre trouvé</h4>
                <p>Commencez par ajouter votre premier livre à la bibliothèque !</p>
                <Link to="/create" className="btn btn-accent">
                  Ajouter le premier livre
                </Link>
              </div>
            </div>
          ) : (
            books.map((book) => (
              <div key={book.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
                <div className="card h-100 shadow-sm border-0 flex-fill book-card">
                  <div className="book-image-container">
                    <img
                      src={`http://localhost:8081/uploads/${book.image}`}
                      alt={`Couverture de ${book.title}`}
                      className="card-img-top"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x450/333333/FFFFFF?text=Couverture+Non+Disponible";
                      }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold mb-3">{book.title}</h5>
                    <div className="mb-3 flex-grow-1">
                      <p className="card-text mb-2">
                        <strong className="text-muted">Auteur :</strong>
                        <span className="ms-1">{book.author}</span>
                      </p>
                      <p className="card-text mb-2">
                        <strong className="text-muted">Année :</strong>
                        <span className="ms-1">{book.year}</span>
                      </p>
                      <p className="card-text">
                        <strong className="text-muted">Catégorie :</strong>
                        <span className="ms-1">{book.category}</span>
                      </p>
                    </div>
                    <div className="d-flex justify-content-between mt-auto">
                      <Link to={`/update/${book.id}`} className="btn btn-outline-accent btn-sm edit-btn">
                        <FaEdit className="me-1" /> Modifier
                      </Link>
                      <button onClick={() => handleDelete(book.id)} className="btn btn-outline-danger btn-sm delete-btn">
                        <FaTrash className="me-1" /> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Books;