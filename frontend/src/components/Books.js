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

    const handleDelete = async (id) => {
        try {
            // Envoi d'une requête DELETE à l'API backend avec l'identifiant du livre
            const res = await axios.delete('http://localhost:8081/books/' + id);

            // Vérifie le résultat renvoyé par le backend : 
            // si 'affectedRows > 0', cela signifie qu'une ligne a bien été supprimée dans la base de données
            if (res.data.affectedRows > 0) {
                // Mise à jour du state local "books"
                // Ici on filtre le tableau pour enlever le livre dont l'id correspond à celui supprimé
                setBooks(books.filter(s => s.id !== id));
            } else {
                // Si aucune ligne n’a été supprimée (par exemple ID inexistant), on envoie un message dans la console
                console.log('Aucun étudiant supprimé, vérifiez l\'ID');
            }
        } catch (err) {
            // Si une erreur survient (connexion, serveur, etc.), elle est affichée dans la console
            console.log("Erreur lors de la suppression :", err);
        }
    }

  return (
    <div>
        <h1 className="h1 ">Notre catalogue de livres</h1>
        <Link to="/create" className='btn btn-success mt-4'> Ajouter un livre </Link>
        <table className="table table-bordered mt-5">
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Auteur</th>
                    <th>Parution</th>
                    <th>Catégorie</th>
                    <th>Image</th>
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
                            <td>
                                {data.image && (
                                    <img
                                    src={`http://localhost:8081/uploads/${data.image}`}
                                    alt="Couverture"
                                    width="60"
                                    />
                                )}
                            </td>
                            <td>{data.created_at}</td>
                            <td className="buttonsBooks">
                                <Link to={`update/${data.id}`} className='btn btn-primary'> Modifier </Link>
                                <button className='btn btn-danger ms-2' onClick={ e => handleDelete(data.id)}> Supprimer </button>
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