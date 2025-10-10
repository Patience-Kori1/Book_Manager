// src/pages/Home.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() { // J'ai renommé Books en Home pour plus de cohérence
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // Gestion des erreurs

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

  // États de chargement et d'erreur
  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "#FBE9E7" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <span className="ms-2">Chargement des livres...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "#FBE9E7" }}>
        <div className="alert alert-danger text-center">
          <h4>Erreur de chargement</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center py-5"
      style={{
        backgroundColor: "#FBE9E7",
        minHeight: "100vh",
      }}
    >
      {/* En-tête */}
      <div className="text-center mb-5">
        <h1
          className="fw-bold display-4 mb-3"
          style={{
            color: "#4E342E",
            textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
          }}
        >
           Ma Bibliothèque
        </h1>
        <p className="lead text-muted mb-4">
          Découvrez et gérez votre collection de livres
        </p>
        <Link to="/create" className="btn btn-success btn-lg">
          ➕ Ajouter un livre
        </Link>
      </div>

      {/* Compteur de livres */}
      {books.length > 0 && (
        <div className="mb-4">
          <span className="badge bg-primary fs-6 p-2">
            {books.length} livre{books.length > 1 ? 's' : ''} dans la bibliothèque
          </span>
        </div>
      )}

      {/* Grille des livres */}
      <div className="container">
        <div className="row g-4 justify-content-center">
          {books.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div className="alert alert-info">
                <h4>Aucun livre trouvé</h4>
                <p>Commencez par ajouter votre premier livre à la bibliothèque !</p>
                <Link to="/create" className="btn btn-info">
                  Ajouter le premier livre
                </Link>
              </div>
            </div>
          ) : (
            books.map((book) => (
              <div key={book.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div
                  className="card h-100 shadow-sm border-0"
                  style={{
                    borderRadius: "15px",
                    backgroundColor: "#FFF8F6",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  {/* Image du livre */}
                  <img
                    src={`http://localhost:8081/uploads/${book.image}`}
                    alt={`Couverture de ${book.title}`}
                    className="card-img-top"
                    style={{
                      height: "280px",
                      objectFit: "cover",
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x400/6D4C41/FFFFFF?text=Couverture+Non+Disponible";
                    }}
                  />

                  {/* Corps de la carte */}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark mb-3">
                      {book.title}
                    </h5>
                    
                    <div className="mb-3 flex-grow-1">
                      <p className="card-text mb-2">
                        <strong className="text-muted">Auteur :</strong> 
                        <span className="ms-1 text-dark">{book.author}</span>
                      </p>
                      <p className="card-text mb-2">
                        <strong className="text-muted">Année :</strong> 
                        <span className="ms-1 text-dark">{book.year}</span>
                      </p>
                      <p className="card-text">
                        <strong className="text-muted">Catégorie :</strong> 
                        <span className="ms-1 text-dark">{book.category}</span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="d-flex justify-content-between mt-auto">
                      <Link
                        to={`/update/${book.id}`}
                        className="btn btn-outline-primary btn-sm"
                        style={{ borderRadius: "20px" }}
                      >
                        ✏️ Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="btn btn-outline-danger btn-sm"
                        style={{ borderRadius: "20px" }}
                      >
                        🗑️ Supprimer
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

export default Home;