const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
const redes = {
  instagram: 'https://instagram.com/furiagg',
  twitter: 'https://twitter.com/furiagg',
  twitch: 'https://twitch.tv/furia',
  youtube: 'https://youtube.com/@furiagg'
};

  res.json(redes);
});

module.exports = router;
