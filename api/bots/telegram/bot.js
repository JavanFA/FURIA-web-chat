require('dotenv').config({ path: __dirname + '/../../.env' });

const { Telegraf } = require('telegraf');
const path = require('path');

// Debug inicial
console.log('=== VERIFICAÇÃO INICIAL ===');
console.log('Diretório atual:', __dirname);
console.log('Caminho do .env:', path.resolve(__dirname, '../../.env'));
console.log('Token carregado:', process.env.TELEGRAM_BOT_TOKEN ? '✔' : '❌ (não encontrado)');

// Verificação EXTRA do ambiente
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('\n❌ ERRO CRÍTICO: Configuração ausente');
  console.log('Solução:');
  console.log('1. Crie/atualize o arquivo .env na pasta /api/ com:');
  console.log('TELEGRAM_BOT_TOKEN=seu_token_aqui');
  console.log('2. Verifique o caminho do arquivo');
  console.log('Caminho esperado:', path.resolve(__dirname, '../../.env'));
  process.exit(1);
}

// Carregamento de handlers com tratamento de erro melhorado
const loadHandler = (handlerName) => {
  try {
    const handler = require(`./handlers/${handlerName}`);
    console.log(`✔ Handler ${handlerName} carregado com sucesso`);
    return handler;
  } catch (err) {
    console.error(`❌ Falha ao carregar handler ${handlerName}:`, err.message);
    return (ctx) => ctx.reply(`⚠️ Recursos temporariamente indisponíveis. Tente novamente mais tarde.`);
  }
};

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, {
  handlerTimeout: 10_000, // 10 segundos timeout
  telegram: { 
    agent: null,
    testEnv: process.env.NODE_ENV === 'test'
  }
});

// Sistema de comandos
const commands = [
  { command: 'start', description: 'Inicia o bot' },
  { command: 'elenco', description: 'Mostra o elenco atual' },
  { command: 'agenda', description: 'Mostra os próximos jogos' },
  { command: 'redes', description: 'Links das redes sociais' },
  { command: 'webchat', description: 'Acesso ao webchat oficial' }
];

// Registro de comandos
commands.forEach(({ command }) => {
  bot.command(command, loadHandler(command));
});

// Tratamento global de erros
bot.catch((err, ctx) => {
  console.error('🔥 ERRO GLOBAL:', err);
  ctx.reply('❌ Ocorreu um erro inesperado. Por favor, tente novamente.');
});

// Inicialização segura com tratamento de foto de perfil
(async () => {
  try {
    // 1. Configura os comandos no menu do bot
    await bot.telegram.setMyCommands(commands);
    
    // 2. Obtém informações do bot
    const botInfo = await bot.telegram.getMe();
    
    console.log('\n=== BOT INICIADO ===');
    console.log(`Nome: @${botInfo.username}`);
    console.log(`ID: ${botInfo.id}`);
    console.log(`Comandos registrados: ${commands.map(c => `/${c.command}`).join(', ')}`);

    // 3. Inicia o bot
    await bot.launch();
    console.log('\n🟢 Bot pronto para receber mensagens');

    // 4. [OPCIONAL] Configuração da foto de perfil
    // Você precisará usar @BotFather para definir a foto permanentemente
    // Mas pode enviar temporariamente com:
    // await bot.telegram.setChatPhoto(botInfo.id, { source: 'caminho/para/furia-logo.png' });
    
  } catch (err) {
    console.error('🔴 FALHA CRÍTICA NA INICIALIZAÇÃO:', err);
    process.exit(1);
  }
})();

// Gerenciamento de shutdown
const shutdownSignals = ['SIGINT', 'SIGTERM'];
shutdownSignals.forEach(signal => {
  process.once(signal, async () => {
    console.log(`\n${signal} recebido - Encerrando graciosamente...`);
    try {
      await bot.stop(signal);
      console.log('Bot encerrado com sucesso');
      process.exit(0);
    } catch (err) {
      console.error('Erro ao encerrar bot:', err);
      process.exit(1);
    }
  });
});

// [OPCIONAL] Tratamento para botões inline
bot.action('elenco_btn', loadHandler('elenco'));
bot.action('agenda_btn', loadHandler('agenda'));
bot.action('redes_btn', loadHandler('redes'));
bot.action('webchat_btn', loadHandler('webchat'));