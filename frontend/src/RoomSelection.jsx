import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

export default function RoomSelection() {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [username, setUsername] = useState('');
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // Carrega salas e dados do usuário
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        // Carrega salas
        const roomsSnapshot = await getDocs(collection(db, 'rooms'));
        const roomsData = roomsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAvailableRooms(roomsData);

        // Carrega username do usuário
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="room-selection">
      <div className="header">
        <h2>Chat da FURIA 🔥</h2>
        <div className="user-info">
          <span>Logado como: {username || 'Carregando...'}</span>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>
      </div>

      <h3>Escolha sua sala de chat</h3>
      <div className="rooms-grid">
        {availableRooms.map((room) => (
          <div 
            key={room.id} 
            className="room-card"
            onClick={() => navigate(`/chat/${room.id}`)}
          >
            <h4>{room.name}</h4>
            <p>{room.description || "Chat da FURIA"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}