import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Books() {

    const [books, setBooks] = useState([]);

    useEffect(() => {
    axios.get('http://localhost:8081/')
      .then(res => setBooks(res.data))
      .catch(err => console.error("Erreur lors du fetch :", err));
    }, []);

  return (
    <div>
        <h1 className="h2 ">Notre collection de livres</h1>
        <Link to="/create" className='btn btn-success mt-4'> Ajouter un livre </Link>
        <table className="table table-bordered mt-5">
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Auteur</th>
                    <th>Parution</th>
                    <th>Catégorie</th>
                    <th>Création</th>
                    <th>Action</th>
                    
                </tr>
            </thead>
            <tbody>
                        {
                            books.map((data, i) => (
                                <tr key={i}> 
                                    <td>{data.title}</td>
                                    <td>{data.author}</td>
                                    <td>{data.year}</td>
                                    <td>{data.category}</td>
                                    <td>{data.created_at}</td>
                                    <td className="buttonsBooks">
                                        <button className='btn btn-primary'> Modifier </button>
                                        <button className='btn btn-danger ms-2'>Supprimer</button>
                                    </td>
                                </tr>
                            ))
                        } 
            </tbody>
        </table>
    </div>
  )
}

export default Books