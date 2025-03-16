const express = require('express');
const cors = require('cors');
const { initDb } = require('./database');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', routes);

// Page d'accueil simple
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Initialiser la base de données et démarrer le serveur
const startServer = async () => {
  try {
    await initDb();
    app.listen(port, () => {
      console.log(`Serveur en cours d'exécution sur le port ${port}`);
    });
  } catch (error) {
    console.error('Erreur au démarrage du serveur:', error);
  }
};

startServer();