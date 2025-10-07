// -------------------------------------------
// FRONTEND : UpdateBook.jsx
// Formulaire de mise à jour (texte + image)
// -------------------------------------------

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UpdateBook() {
  // --- États pour les champs du formulaire ---
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [newImage, setNewImage] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  // Charger le livre existant pour préremplir le formulaire
  useEffect(() => {
    axios
      .get(`http://localhost:8081/books/${id}`)
      .then((res) => {
        const book = res.data;
        setTitle(book.title);
        setAuthor(book.author);
        setYear(book.year);
        setCategory(book.category);
        setCreatedAt(book.created_at);
        setExistingImage(book.image);
      })
      .catch((err) => console.error("Erreur lors du chargement du livre :", err));
  }, [id]);

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Création du FormData pour envoyer texte + fichier
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("year", year);
    formData.append("category", category);
    formData.append("created_at", createdAt);
    if (newImage) formData.append("image", newImage);

    try {
      await axios.put(`http://localhost:8081/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (err) {
      console.error("Erreur de mise à jour :", err);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center">Modifier un livre</h3>
      <form
        onSubmit={handleSubmit}
        className="shadow p-4 rounded bg-light col-md-6 mx-auto"
      >
        <div className="mb-3">
          <label className="form-label">Titre</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Auteur</label>
          <input
            type="text"
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Année</label>
          <input
            type="text"
            className="form-control"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Catégorie</label>
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date de création</label>
          <input
            type="date"
            className="form-control"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
          />
        </div>

        {/* Aperçu de l’image existante */}
        {existingImage && (
          <div className="mb-3 text-center">
            <img
              src={`http://localhost:8081/uploads/${existingImage}`}
              alt="Actuelle"
              width="100"
              className="rounded shadow"
            />
          </div>
        )}

        {/* Upload d’une nouvelle image */}
        <div className="mb-3">
          <label className="form-label">Nouvelle image</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setNewImage(e.target.files[0])}
          />
        </div>

        <div className="text-center">
          <button className="btn btn-success">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}

export default UpdateBook;
