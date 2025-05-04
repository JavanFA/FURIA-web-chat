require('dotenv').config();

module.exports = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  SECRET_PATH: process.env.SECRET_PATH || '/telegram-webhook'
};