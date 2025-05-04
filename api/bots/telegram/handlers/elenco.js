const axios = require('axios');

module.exports = async (ctx) => {
  try {
    const res = await axios.get('http://localhost:3000/elenco');
    const elenco = res.data;

    let msg = '🎮 *Elenco FURIA CS:GO:*\n\n';
    elenco.forEach(j => {
      msg += `• *${j.nome}* — _${j.posicao}_\n`;
    });

    await ctx.reply(msg, { parse_mode: 'Markdown' });

  } catch (err) {
    console.error(err);
    ctx.reply('Erro ao buscar o elenco.');
  }
};
