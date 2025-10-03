
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

// Route GET de base
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

// Lancer le serveur sur le port 8081
app.listen(8081, () => {
  console.log("Je suis un listen et je m'affche en ligne de commande ");
});