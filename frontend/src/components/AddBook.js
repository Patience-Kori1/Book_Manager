import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function AddBook() {

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [category, setCategory] = useState('');
    const [created_at, setCreated_at] = useState('');
    const navigate = useNavigate(); 

    function handleSubmit(event) { //handle submit function for the form
        event.preventDefault(); 
        axios.post('http://localhost:8081/create', {title, author, year, category, created_at}) //methode post on create page form
        .then(res => {
            console.log('insertion réussi:' ,res.data);
            navigate('/'); // après ajout, retour vers la liste
        })
        .catch(err => console.error("Erreur lors de l'ajout :", err));
    }

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
                            value={title}
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
                            value={author}
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
                            value={year}
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
                            value={category}
                            onChange = {e => setCategory(e.target.value)} 
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
                            value={created_at}
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