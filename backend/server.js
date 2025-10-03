// Import d'express
const express = require("express"); //importe Express pour créer un serveur web et gérer les routes HTTP facilement.

const mysql = require("mysql"); //Permet de connecter Node.js à une base de données MySQL et d’exécuter des requêtes SQL. Sans ça tout ce qui concerne mysql ne marcherit pas

const app = express(); //express() crée une instance de serveur qui écoute les requêtes HTTP et permet de définir des routes et middlewares. 1. Définir des routes (app.get(), app.post(), etc.) 2. Utiliser des middlewares (app.use()) 3. Lancer le serveur (app.listen(port))

const cors = require("cors"); //Gérer le Cross-Origin Resource Sharing, nécessaire pour autoriser le frontend React (port 3000) à faire des requêtes vers le backend Node (port 8081).

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:8081",
  ],
  optionsSuccessStatus: 200,
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  headers: 'Content-Type, Authorization',
  credentials: true,
}

app.use(cors(corsOptions));//pour plus de précision mais app.use(cors());faisable
app.use(express.json()); // Middleware pour lire le JSON envoyé dans le body

// Connexion avec la BDD
const database = mysql.createConnection({//createConnection crée connexion unique à la bdd
    host:"localhost",
    user: "root",
    password:"",    
    database: "book_manager"
})

//Pour savoir si la connexion a réussi. On utilise la méthode connect(callback)
database.connect(err => {
    if(err) {
        console.log("Erreur de connexion à la BDD :", err);
    } else {
        console.log("Connecté à la base de données Book_Manager");
    }
});

// Route GET pour envoyer et afficher les donnée de la table books
app.get("/", (req, res) => {

  // res.send("Je suis un get avec res.send() ou res.json() et je m'affiche dans dans le naviguateur.");

   const sql = "SELECT * FROM books"; 

   database.query(sql, (err, data)=> {

    if (err) {
      return res.json("Error")
    }
    return res.json(data)

   })
});

// Route POST pour créer un étudiant
app.post('/create', (req, res) => {
  // Requête SQL pour insérer un nouvel étudiant
  //
  const sql = "INSERT INTO books (`title`, `author`, `year`, `category`, `created_at`) VALUES (?, ?, ?, ?, ?)";//certains ont une erreur avec les deux ? peu etre en mettre qu'un

  // Valeurs à insérer
  const values = [ 
    req.body.title, // Titre du livre
    req.body.author, // Nom de l'auteur
    req.body.year, // Année de parution
    req.body.category, // Catégorie du livre
    req.body.created_at, // Date de création
  ];

  // Exécution de la requête SQL
  database.query(sql, values, (err, data) => {
    // Si une erreur se produit, renvoie un message d'erreur
    if (err) {
      console.log('SQL Error:', err);
      console.log("Erreur de récupération des données :", err);
      return res.status(500).json({ error: 'Erreur de rejaouter un livre' });
    }
    // if(err) return res.json("Error");
    // Sinon, renvoie les données insérées
    return res.json(data);
  })
})

// Lancer le serveur sur le port 8081
app.listen(8081, () => {
  console.log("Je suis un listen et je m'affche en ligne de commande ");
});