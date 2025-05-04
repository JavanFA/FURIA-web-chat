const axios = require('axios');

module.exports = async (ctx) => {
  try {
    const res = await axios.get('http://localhost:3000/agenda');
    const agenda = res.data;

    let msg = '📅 *Próximos jogos:*\n\n';
    agenda.forEach(e => {
      msg += `• ${e.data} — _${e.evento}_\n`;
    });

    await ctx.reply(msg, { parse_mode: 'Markdown' });

  } catch (err) {
    console.error(err);
    ctx.reply('Erro ao buscar a agenda.');
  }
};
