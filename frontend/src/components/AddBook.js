import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function AddBook() {

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null); //Stocke le fichier image sélectionné
    const [created_at, setCreated_at] = useState('');
    const navigate = useNavigate(); 


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Création d’un objet spéciale FormData de JS pour envoyer des objets avec des contenus binaire : texte + fichier, ce que JSON ne sais pas faire, une fois qu'il y a des fichiers: c'est ce qu'on appelle multipart/FormData()
        // Indique à Axios et Express que la requête contient un fichier
        const formData = new FormData();
        formData.append("title", title);
        formData.append("author", author);
        formData.append("year", year);
        formData.append("category", category);
        formData.append("created_at", created_at);
        formData.append("image", image); // Ajout du fichier image

        try {
        await axios.post("http://localhost:8081/create", formData, {
            // l'objet headers est le troisième paramètre officiel de axios  (après l'url et les data) qui souvent contient la configuration, là il indique à axios qu'il lui envoie du cntent de type multipart/form-data parce qu'il y a à la fois du texte et des fichiers mais il est pas forcément obligatoire de le mentionner
            headers: { "Content-Type": "multipart/form-data" },
        });
        navigate("/");
        } catch (err) {
        console.error("Erreur lors de l’ajout :", err);
        }
  };

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center'>
        <div className='w-100 bg-white rounded p-3'>
            <form onSubmit={handleSubmit} >
                <h2 className="h2 mb-5">Informations du livre </h2>
                <div className="mb-3 row">
                    <label 
                        htmlFor="title" 
                        className="col-sm-2 col-form-label">
                            Titre
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="text" 
                            className="form-control" 
                            // value={title}
                            onChange = {e => setTitle(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="mb-3 row">
                    <label 
                        htmlFor="author" 
                        className="col-sm-2 col-form-label">
                            Auteur
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="text" 
                            className="form-control" 
                            // value={author}
                            onChange = {e => setAuthor(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="mb-3 row">
                    <label 
                        htmlFor="year" 
                        className="col-sm-2 col-form-label">
                            Année
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="text" 
                            className="form-control" 
                            // value={year}
                            onChange = {e => setYear(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="mb-3 row">
                    <label 
                        htmlFor="category" 
                        className="col-sm-2 col-form-label">
                            Catégorie
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="text" 
                            className="form-control" 
                            // value={category}
                            onChange = {e => setCategory(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="mb-3 row">
                    <label 
                        htmlFor="image" 
                        className="col-sm-2 col-form-label">
                            Image
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="file" 
                            className="form-control" 
                            // value={image}
                            onChange={(e) => setImage(e.target.files[0])} //Stocke le 
                        />
                    </div>
                </div>

                <div className="mb-3 row">
                    <label 
                        htmlFor="created_at" 
                        className="col-sm-2 col-form-label">
                            Date
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="date" 
                            className="form-control" 
                            // value={created_at}
                            onChange = {e => setCreated_at(e.target.value)} 
                        />
                    </div>
                </div>  
                <button className='btn btn-success'>Soumettre</button>
            </form>
        </div>
    </div>
  )
}

export default AddBook