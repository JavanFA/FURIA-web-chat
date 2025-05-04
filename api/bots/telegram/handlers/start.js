module.exports = async (ctx) => {
  try {
    // 1. Mensagem principal com formatação MarkdownV2
    const welcomeMessage = `
🎉 *Bem\\-vindo ao Bot Oficial da FURIA CS\\:GO* \\!\\n\\n
⚡ *Comandos disponíveis* \\:
/elenco \\- Mostra o elenco completo
/agenda \\- Próximos jogos
/redes \\- Nossas redes sociais
/webchat \\- Acesso ao chat oficial\\n\\n
👇 *Use os botões abaixo* \\:
    `;

    // 2. Teclado inline
    const keyboard = {
      inline_keyboard: [
        [{ text: "👥 Ver Elenco", callback_data: "menu_elenco" }],
        [
          { text: "📅 Agenda", callback_data: "menu_agenda" },
          { text: "🌐 Redes", callback_data: "menu_redes" }
        ],
        [{ text: "💬 WebChat", url: "http://localhost:5173/login" }]
      ]
    };

    // 3. Envio da mensagem
    await ctx.replyWithMarkdownV2(welcomeMessage, {
      reply_markup: keyboard,
      disable_web_page_preview: true
    });

  } catch (err) {
    console.error('‼️ ERRO NO START:', err);
    
    // Mensagem de fallback simplificada
    await ctx.reply(
      'Bem-vindo ao Bot da FURIA! Use:\n' +
      '/elenco - Elenco completo\n' +
      '/agenda - Próximos jogos\n' +
      '/redes - Nossas redes\n' +
      '/webchat - Chat oficial',
      { parse_mode: null } // Sem formatação para garantir entrega
    );
  }
};