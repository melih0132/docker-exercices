const express = require('express');
const router = express.Router();
const { pool } = require('./database');

// Récupérer toutes les tâches
router.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer une nouvelle tâche
router.post('/todos', async (req, res) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Le titre est requis' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO todos (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour une tâche
router.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *',
      [title, completed, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer une tâche
router.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    
    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Basculer l'état d'une tâche (complété/non complété)
router.patch('/todos/:id/toggle', async (req, res) => {
  const { id } = req.params;
  
  try {
    const todo = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    
    if (todo.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    
    const newStatus = !todo.rows[0].completed;
    const result = await pool.query(
      'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
      [newStatus, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors du basculement de l\'état de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;