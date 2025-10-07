import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Books() {
  const [books, setBooks] = useState([]);

  // Récupération des livres au chargement du composant
  useEffect(() => {
    axios
      .get("http://localhost:8081/")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Erreur lors du fetch :", err));
  }, []);

  // Supprimer un livre
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8081/books/${id}`);
      if (res.data.affectedRows > 0) {
        setBooks(books.filter((b) => b.id !== id)); // Met à jour le state sans le livre supprimé
      }
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <div>
      <h1>Notre catalogue de livres</h1>
      <Link to="/create" className="btn btn-success mt-4">
        Ajouter un livre
      </Link>

      <table className="table table-bordered mt-5">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Auteur</th>
            <th>Année</th>
            <th>Catégorie</th>
            <th>Image</th>
            <th>Création</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.year}</td>
              <td>{book.category}</td>
              <td>
                {book.image && (
                  <img
                    src={`http://localhost:8081/uploads/${book.image}`}
                    alt="Couverture"
                    width="60"
                  />
                )}
              </td>
              <td>{book.created_at}</td>
              <td>
                <Link to={`/update/${book.id}`} className="btn btn-primary">
                  Modifier
                </Link>
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => handleDelete(book.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Books;
