const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const webchat = {
    url: "http://localhost:5173/login",
    instrucoes: "Acesse o link para chat ao vivo"
  };
  res.json(webchat);
});

module.exports = router;