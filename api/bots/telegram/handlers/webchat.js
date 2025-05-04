const axios = require('axios');

module.exports = async (ctx) => {
  try {
    // 1. Busca dados da API
    const res = await axios.get(`${process.env.API_URL}/webchat`);
    const webchat = res.data;

    // 2. Formata a mensagem
    let msg = `💬 *WebChat FURIA*\\n\\n` +
              `🔗 Acesse: [${webchat.nome}](${webchat.url})` +
              `\\n\\n${webchat.descricao || ''}`;

    // 3. Envia com botão
    await ctx.replyWithMarkdownV2(msg, {
      reply_markup: {
        inline_keyboard: [[
          { text: "Abrir WebChat", url: webchat.url }
        ]]
      }
    });

  } catch (err) {
    console.error("Erro no webchat:", err);
    await ctx.reply('⚠️ Erro ao acessar o webchat. Tente novamente mais tarde.');
  }
};