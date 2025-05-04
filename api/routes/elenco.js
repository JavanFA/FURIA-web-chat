const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
const elenco = [
  { nome: 'KSCERATO', posicao: 'Rifler' },
  { nome: 'yuurih', posicao: 'Rifler' },
  { nome: 'arT', posicao: 'In-Game Leader (IGL)' },
  { nome: 'chelo', posicao: 'Entry Fragger' },
  { nome: 'saffee', posicao: 'AWPer' }
];

res.json(elenco);
});

module.exports = router;