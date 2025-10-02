
// Import d'express
const express = require("express"); 
const app = express();

// Route GET de base
app.get("/", (req, res) => {
  res.send("Je suis un get avec res.send() ou res.json et je m'affiche dans dans le naviguateur.");
});

// Lancer le serveur sur le port 8081
app.listen(8081, () => {
  console.log("Je suis un listen et je m'affche en ligne de commande ");
});
