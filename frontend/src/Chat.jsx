import { useState, useEffect, useRef } from 'react';
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  getDoc,
  getDocs
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Chat() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [groupedMessages, setGroupedMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Carrega as salas disponíveis
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const roomsSnapshot = await getDocs(collection(db, 'rooms'));
        const roomsData = roomsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAvailableRooms(roomsData);
      } catch (error) {
        console.error("Erro ao carregar salas:", error);
      }
    };

    if (user) loadRooms();
  }, [user]);

  // Carrega os dados do usuário
  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
        }
      };
      loadUserData();
    }
  }, [user]);

  // Formatação da hora
  const formatTime = (timestamp) => {
    try {
      if (!timestamp?.toDate) return '--:--';
      const date = timestamp.toDate();
      return format(date, 'HH:mm', { locale: ptBR });
    } catch {
      return '--:--';
    }
  };

  // Formatação da data para agrupamento
  const formatGroupDate = (timestamp) => {
    try {
      if (!timestamp?.toDate) return '';
      const date = timestamp.toDate();
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) return 'Hoje';
      if (date.toDateString() === yesterday.toDateString()) return 'Ontem';

      return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
    } catch {
      return '';
    }
  };

  // Agrupa mensagens por data
  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      try {
        const date = message.timestamp?.toDate ? message.timestamp.toDate() : new Date();
        const dateKey = date.toDateString();

        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push({
          ...message,
          timestamp: message.timestamp || { toDate: () => date }
        });
      } catch (error) {
        console.error('Erro ao processar mensagem:', message, error);
      }
      return groups;
    }, {});
  };

  // Monitora as mensagens da sala selecionada
  useEffect(() => {
    if (!user || !roomId) return;

    let unsubscribe;
    setLoadingMessages(true);
    setError(null);

    const setupChat = async () => {
      try {
        const q = query(
          collection(db, 'messages'),
          where('room', '==', roomId),
          orderBy('timestamp')
        );

        unsubscribe = onSnapshot(q, 
          (snapshot) => {
            setLoadingMessages(false);
            try {
              const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp || { toDate: () => new Date() }
              }));

              setMessages(msgs);
              setGroupedMessages(groupMessagesByDate(msgs));
              scrollToBottom();
            } catch (error) {
              console.error('Erro ao processar mensagens:', error);
              setError('Erro ao carregar mensagens');
            }
          },
          (error) => {
            setLoadingMessages(false);
            setError('Erro na conexão com o servidor');
            console.error('Erro na conexão com Firestore:', error);
          }
        );

      } catch (error) {
        setLoadingMessages(false);
        setError('Erro ao configurar o chat');
        console.error('Erro ao configurar chat:', error);
      }
    };

    setupChat();

    return () => {
      if (unsubscribe) unsubscribe();
      setLoadingMessages(false);
    };
  }, [user, roomId]);

  // Rolagem automática para a última mensagem
  const scrollToBottom = () => {
    setTimeout(() => {
      try {
        messagesEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      } catch (error) {
        console.error('Erro no scroll:', error);
      }
    }, 150);
  };

  // Envio de mensagem
  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user || isSending) return;

    setIsSending(true);
    try {
      const messageData = {
        text: newMessage.trim(),
        timestamp: serverTimestamp(),
        user: userData?.username || user.email.split('@')[0],
        userId: user.uid,
        room: roomId,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'messages'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Erro detalhado ao enviar:', {
        error: error.message,
        code: error.code,
        user: user?.uid
      });
      setError('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSending(false);
    }
  };

  // Envio com Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessage(e);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Redirecionamento se não estiver logado
  if (!user) {
    return (
      <div className="chat-container">
        <h2>Você precisa estar logado para acessar o chat</h2>
        <button onClick={() => navigate('/login')} className="auth-button">
          Ir para Login
        </button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button onClick={() => navigate('/rooms')} className="back-button">
          &larr; Voltar para salas
        </button>
        <h2>Chat da FURIA 🔥 - {availableRooms.find(r => r.id === roomId)?.name || roomId}</h2>
        <div className="user-info">
          <span>Logado como: {userData?.username || user.email.split('@')[0]}</span>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Fechar</button>
        </div>
      )}

      <div className="messages">
        {loadingMessages ? (
          <div className="loading-messages">Carregando mensagens...</div>
        ) : Object.entries(groupedMessages).length > 0 ? (
          Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
            <div key={dateKey}>
              <div className="date-divider">
                {formatGroupDate(dateMessages[0].timestamp)}
              </div>

              {dateMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${
                    msg.userId === user.uid ? 'my-message' : 'other-message'
                  }`}
                >
                  <div className="message-header">
                    <strong>{msg.user || 'Usuário'}</strong>
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="no-messages">Nenhuma mensagem ainda. Envie a primeira!</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending || newMessage.trim() === ''}
          className={isSending ? 'sending' : ''}
        >
          {isSending ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}