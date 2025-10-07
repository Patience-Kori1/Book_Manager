// Import des modules nécessaires
const express = require("express");           // Framework pour créer le serveur et gérer les routes
const mysql = require("mysql");               // Pour connecter Node.js à MySQL
const cors = require("cors");                 // Pour gérer les requêtes cross-origin (React <-> Node)
const multer = require("multer");             // Pour gérer l’upload de fichiers (images)
const path = require("path");                 // Pour manipuler les chemins de fichiers

// Création de l'application Express
const app = express();

// --- Configuration CORS ---
// Permet à React (localhost:3000) d'accéder aux routes backend
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:8081"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware pour parser le JSON dans les requêtes POST/PUT
app.use(express.json());

// --- Gestion des fichiers statiques (images) ---
// Permet à React d'accéder aux images via http://localhost:8081/uploads/nomImage.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Configuration Multer pour le stockage des images ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Tous les fichiers sont stockés dans le dossier uploads
  },
  filename: (req, file, cb) => {
    // On crée un nom unique pour éviter les collisions : timestamp + extension d’origine
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage }); // Middleware Multer

// --- Connexion à la base de données MySQL ---
const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "book_manager",
});

// Vérification de la connexion à la BDD
database.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la BDD :", err);
  } else {
    console.log("Connecté à la base de données Book_Manager");
  }
});

// ------------------- ROUTES -------------------

// GET : récupérer tous les livres
app.get("/", (req, res) => {
  const sql = "SELECT * FROM books";
  database.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur SQL", details: err });
    return res.json(data);
  });
});

// GET : récupérer un livre par son ID
app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM books WHERE id = ?";
  database.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur serveur", details: err });
    if (!data || data.length === 0) return res.status(404).json({ error: "Livre non trouvé", id });
    return res.json(data[0]); // On retourne le premier résultat (il n’y a qu’un livre par ID)
  });
});

// POST : créer un livre avec image
app.post("/create", upload.single("image"), (req, res) => {
  // Préparer la requête SQL
  const sql =
    "INSERT INTO books (`title`, `author`, `year`, `category`, `image`, `created_at`) VALUES (?, ?, ?, ?, ?, ?)";
  
  // Préparer les valeurs à insérer
  const values = [
    req.body.title,
    req.body.author,
    req.body.year,
    req.body.category,
    req.file ? req.file.filename : null, // Nom de l'image si elle existe
    req.body.created_at,
  ];

  // Exécution de la requête SQL
  database.query(sql, values, (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur ajout livre", details: err });
    return res.json(data);
  });
});

// PUT : mise à jour d’un livre avec possibilité de changer l’image
app.put("/update/:id", upload.single("image"), (req, res) => {
  const id = req.params.id;

  // Si une nouvelle image est uploadée, on met à jour la colonne image
  const sql = req.file
    ? "UPDATE books SET title=?, author=?, year=?, category=?, image=?, created_at=? WHERE id=?"
    : "UPDATE books SET title=?, author=?, year=?, category=?, created_at=? WHERE id=?";

  const values = req.file
    ? [
        req.body.title,
        req.body.author,
        req.body.year,
        req.body.category,
        req.file.filename,
        req.body.created_at,
        id,
      ]
    : [
        req.body.title,
        req.body.author,
        req.body.year,
        req.body.category,
        req.body.created_at,
        id,
      ];

  database.query(sql, values, (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur mise à jour", details: err });
    return res.json(data);
  });
});

// DELETE : supprimer un livre
app.delete("/books/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM books WHERE id = ?";
  database.query(sql, [id], (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur suppression", details: err });
    return res.json(data);
  });
});

// --- Lancer le serveur ---
app.listen(8081, () => {
  console.log("Serveur backend démarré sur http://localhost:8081");
});

