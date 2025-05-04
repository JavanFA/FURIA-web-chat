const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
const agenda = [
  { data: '10/05/2025', evento: 'IEM Dallas - vs. Team Liquid' },
  { data: '12/05/2025', evento: 'BLAST Showmatch' }
];

  res.json(agenda);
});

module.exports = router;
