// Import d'express
const express = require("express"); //importe Express pour créer un serveur web et gérer les routes HTTP facilement.

const mysql = require("mysql"); //Permet de connecter Node.js à une base de données MySQL et d’exécuter des requêtes SQL. Sans ça tout ce qui concerne mysql ne marcherit pas
const cors = require("cors"); //Gérer le Cross-Origin Resource Sharing, nécessaire pour autoriser le frontend React (port 3000) à faire des requêtes vers le backend Node (port 8081).
const multer = require("multer"); //Permet la gestion des fichiers uploadés (images). Il Intercepte et enregistre le fichier dans /uploads
const path = require("path"); //Permet de manipuler les chemins de fichiers

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

// --- GESTION DES FICHIERS STATIQUES (images) ---
//Permet à React d'accéder aux fichiers contenus dans /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- CONFIGURATION MULTER POUR LES IMAGES ---
//On définit l'emplacement de stockage et le nom des fichiers uploadés
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); //dossier où les images seront stockées
  },
  filename: (req, file, cb) => {
    // Nom unique du fichier (date + nom d’origine)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }); // Middleware Multer

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
//upload.single("image") ==> Dit à Express de s’attendre à un seul fichier avec le nom image
app.post('/create', upload.single("image"), (req, res) => {

  console.log("Données reçues : ", req.body); // pour visualiser dans le terminal du backend les données du livre ajouté
  console.log("Image reçue :", req.file); // Pour voir dans le terminal si l'img a été reçu

  // Requête SQL pour insérer un nouvel étudiant
  const sql = "INSERT INTO books (`title`, `author`, `year`, `category`, `image`, `created_at`) VALUES (?, ?, ?, ?, ?, ?)";
  
  // Valeurs à insérer
  const values = [ 
    req.body.title, // Titre du livre
    req.body.author, // Nom de l'auteur
    req.body.year, // Année de parution
    req.body.category, // Catégorie du livre
    req.file ? req.file.filename : null, // Enregistre juste le nom du fichier
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

//Route PUT : mise à jour d’un livre (avec possibilité de changer l’image)
//upload.single("image") ==> Dit à Express de s’attendre à un seul fichier avec le nom image
app.put("/update/:id", upload.single("image"), (req, res) => {
  const id = req.params.id;
  console.log("Update livre ID :", id);

  // Si une image est envoyée, on la prend, sinon on garde l'ancienne
  const sql = req.file
    ? "UPDATE books SET title=?, author=?, year=?, category=?, image=?, created_at=? WHERE id=?"
    : "UPDATE books SET title=?, author=?, year=?, category=?, created_at=? WHERE id=?";//Dans cette deuxième requete il n'y a pas d'image au cas où le user n'a pas mise à jour l'image

  const values = req.file
    ? [
        req.body.title,
        req.body.author,
        req.body.year,
        req.body.category,
        req.file.filename, //Nouveau nom de fichier
        req.body.created_at,
        id,
      ]
    : [ //Dans cette deuxième requete il n'y a pas d'image au cas où le user n'a pas mise à jour l'image
        req.body.title,
        req.body.author,
        req.body.year,
        req.body.category,
        req.body.created_at,
        id,
      ];

  database.query(sql, values, (err, data) => {
    if (err) return res.json("Error");
    return res.json(data);
  });
});


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

// Route pour supprimer un livre
app.delete('/books/:id', (req, res) => {
  // Requête SQL pour supprimer un étudiant
  const sql = "DELETE FROM books WHERE id =?";
  // ID de l'étudiant à supprimer
  const id = req.params.id; 
  
  // Exécution de la requête SQL
  database.query(sql, [id], (err, data) => {
    // Si une erreur se produit, renvoie un message d'erreur
    if(err) return res.json("Error");
    // Sinon, renvoie les données supprimées
    return res.json(data);
  })
})

// Lancer le serveur sur le port 8081
app.listen(8081, () => {
  console.log("Je suis un listen et je m'affche en ligne de commande ");
});