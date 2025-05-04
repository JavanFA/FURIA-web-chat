import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { serverTimestamp } from "firebase/firestore";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);
  const navigate = useNavigate();

  const debouncedUsername = useDebounce(username, 500);
  const debouncedEmail = useDebounce(email, 500);

  // Verifica username
  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername.length < 3) {
        setIsUsernameAvailable(null);
        return;
      }

      setIsChecking(true);
      try {
        const q = query(collection(db, "users"), 
          where("username", "==", debouncedUsername.toLowerCase()));
        const snapshot = await getDocs(q);
        setIsUsernameAvailable(snapshot.empty);
      } catch (err) {
        console.error("Erro ao verificar username:", err);
        setError("Erro ao verificar disponibilidade");
      } finally {
        setIsChecking(false);
      }
    };

    checkUsername();
  }, [debouncedUsername]);

  // Verifica email
  useEffect(() => {
    const checkEmail = async () => {
      if (!debouncedEmail.includes('@')) {
        setIsEmailAvailable(null);
        return;
      }

      setIsChecking(true);
      try {
        const q = query(collection(db, "users"), 
          where("email", "==", debouncedEmail.toLowerCase()));
        const snapshot = await getDocs(q);
        setIsEmailAvailable(snapshot.empty);
      } catch (err) {
        console.error("Erro ao verificar email:", err);
        setError("Erro ao verificar email");
      } finally {
        setIsChecking(false);
      }
    };

    checkEmail();
  }, [debouncedEmail]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (isChecking) {
      setError("Aguarde a verificação");
      return;
    }

    if (username.length < 3) {
      setError("Username deve ter pelo menos 3 caracteres");
      return;
    }

    if (!isUsernameAvailable) {
      setError("Username já está em uso");
      return;
    }

    if (!email.includes('@')) {
      setError("Email inválido");
      return;
    }

    if (!isEmailAvailable) {
      setError("Email já cadastrado");
      return;
    }

    if (password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        createdAt: serverTimestamp()
      });
      
      navigate('/rooms'); // Alterado para redirecionar para /rooms
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Criar Conta</h2>
      <form onSubmit={handleSignup}>
        {/* Campo Username */}
        <div className="form-group">
          <label>Username (mín. 3 caracteres)</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ex: furia_fan123"
            required
            minLength={3}
          />
          <div className="status-indicator">
            {isChecking && username === debouncedUsername ? (
              <span className="checking">Verificando...</span>
            ) : username.length > 0 && isUsernameAvailable !== null && (
              <span className={isUsernameAvailable ? 'available' : 'taken'}>
                {isUsernameAvailable ? '✔ Disponível' : '✖ Já em uso'}
              </span>
            )}
          </div>
        </div>

        {/* Campo Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ex: exemplo@email.com"
            required
          />
          <div className="status-indicator">
            {isChecking && email === debouncedEmail ? (
              <span className="checking">Verificando...</span>
            ) : email.includes('@') && isEmailAvailable !== null && (
              <span className={isEmailAvailable ? 'available' : 'taken'}>
                {isEmailAvailable ? '✔ Email válido' : '✖ Email já cadastrado'}
              </span>
            )}
          </div>
        </div>

        {/* Campo Senha */}
        <div className="form-group">
          <label>Senha (mín. 6 caracteres)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          disabled={isChecking || !isUsernameAvailable || !isEmailAvailable}
          className="submit-btn"
        >
          {isChecking ? 'Processando...' : 'Cadastrar'}
        </button>
      </form>
      
      <p className="auth-link">
        Já tem conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
}