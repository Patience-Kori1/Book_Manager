// Import d'express
const express = require("express"); //importe Express pour créer un serveur web et gérer les routes HTTP facilement.

const mysql = require("mysql"); //Permet de connecter Node.js à une base de données MySQL et d’exécuter des requêtes SQL. Sans ça tout ce qui concerne mysql ne marcherit pas

const cors = require("cors"); //Gérer le Cross-Origin Resource Sharing, nécessaire pour autoriser le frontend React (port 3000) à faire des requêtes vers le backend Node (port 8081).

const app = express(); //express() crée une instance de serveur qui écoute les requêtes HTTP et permet de définir des routes et middlewares. 1. Définir des routes (app.get(), app.post(), etc.) 2. Utiliser des middlewares (app.use()) 3. Lancer le serveur (app.listen(port))


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

  console.log(req.body); // pour visualiser dans le terminal du backend les données du livre ajouté

  // Requête SQL pour insérer un nouvel étudiant
  const sql = "INSERT INTO books (`title`, `author`, `year`, `category`, `created_at`) VALUES (?, ?, ?, ?, ?)";
  
  // Valeurs à insérer
  const values = [ 
    req.body.title, // Titre du livre
    req.body.author, // Nom de l'auteur
    req.body.year, // Année de parution
    req.body.category, // Catégorie du livre
    req.body.created_at, // Date de création
  ];

  // Exécution de la requête SQL, sql c'est la requete, values c'est les valeur à insérer
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

// Route PUT pour modifier un livre existant
app.put('/update/:id', (req, res) => {

  // Requête SQL pour modifier un étudiant
  const sql = "update books set `title` =?, `author` =?, `year` =?, `category` =?, `created_at` =?   where id =?";

  // Valeurs à modifier
  const values = [ 
    req.body.title, // Titre du livre
    req.body.author, // Nom de l'auteur
    req.body.year, // Année de parution
    req.body.category, // Catégorie du livre
    req.body.created_at, // Date de création
  ];

  // ID de l'étudiant à modifier
  const id = req.params.id; // récupère l'id de l'URL

  // Exécution de la requête SQL
  database.query(sql, [...values, id], (err, data) => {
   // Si une erreur se produit, renvoie un message d'erreur
    if(err) {return res.json("Error")};
    // Sinon, renvoie les données modifiées
    return res.json(data);
  })
})

// Route pour récupérer et afficher dans les inputs les données du livre par son ID (propre, avec logs)
app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  console.log(">>> GET /create/:id reçu — id =", id);

  const sql = "SELECT * FROM books WHERE id = ?";
  database.query(sql, [id], (err, data) => {
    console.log(`Ceci est mon data:  ${sql}, ${id}` );
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ error: "Erreur serveur", details: err });
    }
    if (!data || data.length === 0) {
      console.warn("Aucun enregistrement trouvé pour id =", id);
      return res.status(404).json({ error: "Étudiant non trouvé", id });
    }
    console.log("Étudiant trouvé:", data[0]);
    return res.json(data[0]);
  });
});

// Lancer le serveur sur le port 8081
app.listen(8081, () => {
  console.log("Je suis un listen et je m'affche en ligne de commande ");
});