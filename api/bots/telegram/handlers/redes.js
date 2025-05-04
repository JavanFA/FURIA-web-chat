const axios = require('axios');

module.exports = async (ctx) => {
  try {
    const res = await axios.get('http://localhost:3000/redes');
    const redes = res.data;

    const msg = `🌐 *Redes da FURIA:*\n\n` +
                `📸 Instagram: ${redes.instagram}\n` +
                `🐦 Twitter: ${redes.twitter}\n` +
                `🎮 Twitch: ${redes.twitch}\n` +
                `▶️ YouTube: ${redes.youtube}`;

    await ctx.reply(msg, { parse_mode: 'Markdown' });

  } catch (err) {
    console.error(err);
    ctx.reply('Erro ao buscar as redes.');
  }
};
