const express = require('express');
const router = express.Router();

const clients = require('./clients');

router.get('/', (req, res) => clients.getAll(req, res));
router.get('/:id', (req, res) => clients.getById(req, res));

module.exports = router;