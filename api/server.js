require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

// Configurações
app.use(cors());
app.use(express.json());

// Rotas
app.use('/elenco', require('./routes/elenco'));
app.use('/agenda', require('./routes/agenda'));
app.use('/redes', require('./routes/redes'));
app.use('/webchat', require('./routes/webchat'));

// Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});