import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Busca email pelo username
      const q = query(collection(db, 'users'), where('username', '==', username.toLowerCase()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('Usuário não encontrado');
        setIsLoading(false);
        return;
      }

      const userData = snapshot.docs[0].data();
      const email = userData.email;

      // Faz login com email e senha
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/rooms'); // Alterado para redirecionar para /rooms
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Senha incorreta ou erro no login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login FURIA 🔥</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Usuário</label>
          <input
            type="text"
            placeholder="Digite seu usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="submit-btn"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="auth-link">
        Não tem conta? <Link to="/signup">Cadastre-se</Link>
      </p>
    </div>
  );
}