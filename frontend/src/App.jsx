import { Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>FURIA CS:GO FAN CHAT</h1>
        <p>Acompanhe o time em tempo real e converse com outros fãs!</p>
        
        <div className="chat-options">
          {/* Opção 1: Webchat (existente) */}
          <div className="chat-option">
            <h2>Webchat FURIA</h2>
            <p>Converse com a comunidade em tempo real</p>
            <Link to="/rooms" className="cta-button">ENTRAR NO WEBCHAT</Link>
          </div>

          {/* Opção 2: Telegram Bot (nova) */}
          <div className="chat-option">
            <h2>Telegram Bot</h2>
            <p>Receba notícias e converse pelo Telegram</p>
            <a 
              href="https://t.me/furiatele_bot" 
              className="cta-button telegram-button"
              target="_blank" 
              rel="noopener noreferrer"
            >
              ACESSAR TELEGRAM BOT
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;