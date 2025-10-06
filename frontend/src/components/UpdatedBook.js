import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateBook () {

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [category, setCategory] = useState('');
    const [created_at, setCreated_at] = useState('');
    const [image, setImage] = useState(null); // 🧩 Fichier sélectionné
    const [existingImage, setExistingImage] = useState(""); // 🧩 Image actuelle

    const navigate = useNavigate(); 
    const { id } = useParams();

    // --- Récupération des données existantes du livre ---
    useEffect(() => {
        axios.get(`http://localhost:8081/books/${id}`)
        .then(res => {
            setTitle(res.data.title);
            setAuthor(res.data.author);
            setYear(res.data.year);
            setCategory(res.data.category);
            setCreated_at(res.data.created_at);
            setExistingImage(res.data.image); // 🧩 sauvegarde de l’image actuelle
        })
        .catch(err => console.error("Erreur lors du fetch du livre :", err));
    }, [id]);

    // --- Soumission du formulaire ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("author", author);
        formData.append("year", year);
        formData.append("category", category);
        formData.append("created_at", created_at);
        if (image) formData.append("image", image); // 🧩 uniquement si nouvelle image

        try {
            await axios.put(`http://localhost:8081/update/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate("/");
        } catch (err) {
            console.error("Erreur lors de la mise à jour :", err);
        }
    };

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center'>
            <div className='w-100 bg-white rounded p-3'>
                <form onSubmit={handleSubmit}>
                    <h2 className="h2 mb-5">Modification du livre</h2>

                    {/* --- Titre --- */}
                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label">Titre</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" value={title || ''} onChange={e => setTitle(e.target.value)} />
                        </div>
                    </div>

                    {/* --- Auteur --- */}
                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label">Auteur</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" value={author || ''} onChange={e => setAuthor(e.target.value)} />
                        </div>
                    </div>

                    {/* --- Année --- */}
                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label">Année</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" value={year || ''} onChange={e => setYear(e.target.value)} />
                        </div>
                    </div>

                    {/* --- Catégorie --- */}
                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label">Catégorie</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" value={category || ''} onChange={e => setCategory(e.target.value)} />
                        </div>
                    </div>

                    {/* --- Image --- */}
                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label">Image</label>
                        <div className="col-sm-10">
                            {existingImage ? (
                                <div className="mb-2">
                                    <p>Image actuelle :</p>
                                    <img
                                        src={`http://localhost:8081/uploads/${existingImage}`}
                                        alt="Aperçu"
                                        width="80"
                                        className="border rounded"
                                    />
                                </div>
                            ) : (
                                <p>Aucune image disponible</p>
                            )}
                            <input type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
                        </div>
                    </div>

                    {/* --- Date --- */}
                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label">Date</label>
                        <div className="col-sm-10">
                            <input type="date" className="form-control" value={created_at || ''} onChange={e => setCreated_at(e.target.value)} />
                        </div>
                    </div>

                    <button className='btn btn-success'>Soumettre</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateBook;
