import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Books() {
  // État local pour stocker la liste des livres récupérés depuis le backend
  const [books, setBooks] = useState([]);

  // useEffect : s’exécute après le premier rendu du composant
  // On récupère la liste des livres via une requête GET à l’API backend
  useEffect(() => {
    axios
      .get("http://localhost:8081/")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Erreur lors du chargement des livres :", err));
  }, []);

  // Fonction pour supprimer un livre (appel DELETE à l’API)
  const handleDelete = async (id) => {
    if (window.confirm("Souhaitez-vous vraiment supprimer ce livre ?")) {
      try {
        await axios.delete(`http://localhost:8081/books/${id}`);
        // On met à jour la liste des livres sans recharger la page
        setBooks(books.filter((book) => book.id !== id));
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
      }
    }
  };

  return (
    <div className="container my-5">
      {/* Titre principal */}
      <h2 className="text-center mb-4">📚 Liste des livres</h2>

      {/* Bouton pour aller sur la page d’ajout */}
      <div className="text-center mb-4">
        <Link to="/create" className="btn btn-success">
          ➕ Ajouter un livre
        </Link>
      </div>

      {/* Grille responsive Bootstrap (3 colonnes sur grand écran, 2 sur moyen, 1 sur mobile) */}
      <div className="row">
        {books.map((book) => (
          <div key={book.id} className="col-md-4 col-sm-6 mb-4">
            <div className="card h-100 shadow-sm border-0">
              {/* Image du livre */}
              <img
                src={`http://localhost:8081/uploads/${book.image}`}
                alt={book.title}
                className="card-img-top"
                style={{
                  height: "250px",
                  objectFit: "cover",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              />

              {/* Contenu texte de la carte */}
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title fw-bold">{book.title}</h5>
                  <p className="card-text mb-1">
                    <strong>Auteur :</strong> {book.author}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Année :</strong> {book.year}
                  </p>
                  <p className="card-text">
                    <strong>Catégorie :</strong> {book.category}
                  </p>
                </div>

                {/* Boutons d’action */}
                <div className="d-flex justify-content-between mt-3">
                  <Link
                    to={`/update/${book.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    ✏️ Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Si aucun livre n’est trouvé */}
        {books.length === 0 && (
          <p className="text-center text-muted mt-5">
            Aucun livre trouvé pour le moment 📭
          </p>
        )}
      </div>
    </div>
  );
}

export default Books;
