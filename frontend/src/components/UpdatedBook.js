import React from 'react'

function UpdatedBook() {

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center'>
            <div className='w-100 bg-white rounded p-3'>
                <form >
                    <h2 className="h2 mb-5"> Modification du livre </h2>
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
                                // onChange = {e => setTitle(e.target.value)} 
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
                                // onChange = {e => setAuthor(e.target.value)} 
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
                                // onChange = {e => setYear(e.target.value)} 
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
                                // onChange = {e => setCategory(e.target.value)} 
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
                                // onChange = {e => setCreated_at(e.target.value)} 
                            />
                        </div>
                    </div>  
                    <button className='btn btn-success'>Soumettre</button>
                </form>
            </div>
        </div>
    )
}

export default UpdatedBook